"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  createConnection,
  startConnection,
  stopConnection,
  on,
  off,
  getOnlineUsers,
  getConnection,
  HubConnectionState,
  acknowledgeMessageReceived,
} from "@/lib/signalr";
import { setUserStatus, setOnlineUsers } from "@/features/user/user.slice";
import {
  receiveMessage,
  updateMessageStatus,
  messageRecalled,
  markAllAsSeen,
  markAllAsDelivered,
} from "@/features/messages/message.slice";
import { upsertConversationWithMessage } from "@/features/conversations/conversation.slice";
import { UserStatus, MessageReadStatus } from "@/constants/enum";
import type { IMessage } from "@/features/messages/message.type";
import type { IConversation } from "@/features/conversations/conversation.type";

interface IUserStatusChangedEvent {
  userId: string;
  status: UserStatus;
}

interface IMessageStatusChangedEvent {
  messageId: string;
  conversationId: string;
  userId: string;
  status: MessageReadStatus;
}

interface IConversationSeenEvent {
  conversationId: string;
  userId: string;
  status: MessageReadStatus;
}

interface IMessageRecalledEvent {
  conversationId: string;
  messageId: string;
}

interface IConversationDeliveredEvent {
  conversationId: string;
  userId: string;
  status: MessageReadStatus;
}

interface IMessageDeliveredEvent {
  messageId: string;
  conversationId: string;
  status: MessageReadStatus;
}

export function useSignalR() {
  const dispatch = useAppDispatch();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const isConnectedRef = useRef(false);

  // Use ref for currentConversationId to avoid triggering callback re-creation
  const currentConversationId = useAppSelector((state) => state.conversation.conversation?.id);
  const currentConversationIdRef = useRef<string | undefined>(currentConversationId);

  // Keep ref in sync with state
  useEffect(() => {
    currentConversationIdRef.current = currentConversationId;
  }, [currentConversationId]);

  // Get token from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setAccessToken(token);
  }, []);

  const handleUserStatusChanged = useCallback(
    (data: IUserStatusChangedEvent) => {
      console.log("SignalR: UserStatusChanged", data);
      dispatch(setUserStatus({ userId: data.userId, status: data.status }));
    },
    [dispatch],
  );

  // Handler for new event format: (conversation, message)
  // Using ref to avoid re-creating callback when conversation changes
  const handleReceiveMessage = useCallback(
    async (conversation: IConversation, message: IMessage) => {
      console.log("SignalR: ReceiveMessage", { conversation, message });

      // Always update conversation list (move to top with new last message)
      dispatch(upsertConversationWithMessage({ conversation, message }));

      // Only add message to messages state if user is viewing this conversation
      if (currentConversationIdRef.current === conversation.id) {
        dispatch(receiveMessage(message));
      }

      // Acknowledge receipt - triggers MessageDelivered event back to sender
      try {
        await acknowledgeMessageReceived(message.id);
      } catch (error) {
        console.error("Failed to acknowledge message:", error);
      }
    },
    [dispatch], // No currentConversationId dependency - using ref instead
  );

  const handleMessageStatusChanged = useCallback(
    (data: IMessageStatusChangedEvent) => {
      console.log("SignalR: MessageStatusChanged", data);
      dispatch(
        updateMessageStatus({ messageId: data.messageId, conversationId: data.conversationId, status: data.status }),
      );
    },
    [dispatch],
  );

  const handleConversationSeen = useCallback(
    (data: IConversationSeenEvent) => {
      console.log("SignalR: ConversationSeen", data);
      // Update all messages in this conversation to Seen status (for sender's perspective)
      dispatch(markAllAsSeen({ conversationId: data.conversationId, userId: data.userId }));
    },
    [dispatch],
  );

  const handleMessageRecalled = useCallback(
    (data: IMessageRecalledEvent) => {
      console.log("SignalR: MessageRecalled", data);
      dispatch(messageRecalled({ messageId: data.messageId }));
    },
    [dispatch],
  );

  const handleConversationDelivered = useCallback(
    (data: IConversationDeliveredEvent) => {
      console.log("SignalR: ConversationDelivered", data);
      dispatch(markAllAsDelivered({ conversationId: data.conversationId, userId: data.userId }));
    },
    [dispatch],
  );

  const handleMessageDelivered = useCallback(
    (data: IMessageDeliveredEvent) => {
      console.log("SignalR: MessageDelivered", data);
      dispatch(
        updateMessageStatus({ messageId: data.messageId, conversationId: data.conversationId, status: data.status }),
      );
    },
    [dispatch],
  );

  const connect = useCallback(async () => {
    if (!accessToken || isConnectedRef.current) return;

    try {
      createConnection(accessToken);
      await startConnection();

      // Check if we actually connected (startConnection might have returned early)
      const conn = getConnection();
      if (!conn || conn.state !== HubConnectionState.Connected) {
        console.log("SignalR: Connection not established yet, will retry later");
        return;
      }

      isConnectedRef.current = true;

      // Register event handlers
      on("UserStatusChanged", handleUserStatusChanged);
      // Updated: ReceiveMessage now receives (conversation, message)
      on("ReceiveMessage", (conversation: IConversation, message: IMessage) => {
        handleReceiveMessage(conversation, message);
      });
      on("MessageStatusChanged", handleMessageStatusChanged);
      on("ConversationSeen", handleConversationSeen);
      on("ConversationDelivered", handleConversationDelivered);
      on("MessageDelivered", handleMessageDelivered);
      on("MessageRecalled", handleMessageRecalled);

      // Fetch initial online users
      try {
        const onlineUserIds = await getOnlineUsers();
        const onlineUsersMap = onlineUserIds.reduce(
          (acc, userId) => {
            acc[userId] = UserStatus.Online;
            return acc;
          },
          {} as Record<string, UserStatus>,
        );
        dispatch(setOnlineUsers(onlineUsersMap));
      } catch (error) {
        console.error("SignalR: Failed to get online users", error);
      }
    } catch (error) {
      console.error("SignalR: Failed to connect", error);
      isConnectedRef.current = false;
    }
  }, [
    accessToken,
    dispatch,
    handleUserStatusChanged,
    handleReceiveMessage,
    handleMessageStatusChanged,
    handleConversationSeen,
    handleConversationDelivered,
    handleMessageDelivered,
    handleMessageRecalled,
  ]);

  const disconnect = useCallback(async () => {
    if (!isConnectedRef.current) return;

    // Unregister event handlers
    off("UserStatusChanged");
    off("ReceiveMessage");
    off("MessageStatusChanged");
    off("ConversationSeen");
    off("ConversationDelivered");
    off("MessageDelivered");
    off("MessageRecalled");

    await stopConnection();
    isConnectedRef.current = false;
  }, []);

  // Connection lifecycle management
  useEffect(() => {
    if (accessToken) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [accessToken, connect, disconnect]);

  // Handle tab close/refresh - ensure SignalR disconnects
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Synchronously stop connection on tab close
      stopConnection();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Return connection state checker
  const isConnected = useCallback(() => {
    const conn = getConnection();
    return conn?.state === HubConnectionState.Connected;
  }, []);

  return { isConnected, connect, disconnect };
}
