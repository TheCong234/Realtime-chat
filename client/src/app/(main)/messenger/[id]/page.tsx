"use client";
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { toast } from "sonner";

import { ChatMessage } from "./ChatMessage";
import Toolbar from "../../components/Toolbar";
import Footer from "../../components/Footer";
import RecipientInfo from "./RecipientInfo";
import { cn } from "@/lib/utils";
import { RootState } from "@/store";
import { fetchMessages, loadMoreMessages } from "@/features/messages/message.slice";
import { fetchConversationDetails } from "@/features/conversations/conversation.slice";
import { UserStatus } from "@/constants/enum";
import { IMAGE_DOMAIN } from "@/environments";

const ChatPage = () => {
  const params = useParams();
  const conversationId = params.id as string;
  const dispatch = useDispatch();

  const virtuosoRef = useRef<VirtuosoHandle>(null);

  /** ================= REFS ================= */
  const isInitializedRef = useRef(false);
  const isLoadingMoreRef = useRef(false);
  const latestMessageIdRef = useRef<string | null>(null);
  const hasShownEndToastRef = useRef(false);
  const previousMessagesLengthRef = useRef(0);

  /** ================= STATE ================= */
  const [showInfo, setShowInfo] = useState(false);
  const [firstItemIndex, setFirstItemIndex] = useState(10000);

  /** ================= STORE ================= */
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { messages, hasMore, loadingMore } = useSelector((state: RootState) => state.message);
  const { conversation } = useSelector((state: RootState) => state.conversation);

  /** ================= FETCH ================= */
  useEffect(() => {
    if (!conversationId) return;

    // Reset tất cả state khi chuyển conversation
    isInitializedRef.current = false;
    isLoadingMoreRef.current = false;
    latestMessageIdRef.current = null;
    hasShownEndToastRef.current = false;
    previousMessagesLengthRef.current = 0;
    setFirstItemIndex(10000);

    dispatch(fetchMessages(conversationId));
    dispatch(fetchConversationDetails(conversationId));
  }, [conversationId, dispatch]);

  /** ================= INITIAL SCROLL ================= */
  useEffect(() => {
    if (messages.length > 0 && !isInitializedRef.current) {
      // Đánh dấu đã khởi tạo để tránh auto-load page 2
      isInitializedRef.current = true;
      previousMessagesLengthRef.current = messages.length;
      latestMessageIdRef.current = messages[messages.length - 1]?.id ?? null;

      // Scroll to bottom sau một chút delay
      setTimeout(() => {
        virtuosoRef.current?.scrollToIndex({
          index: messages.length - 1,
          align: "end",
          behavior: "auto",
        });
      }, 100);
    }
  }, [messages]);

  /** ================= HANDLE LOAD MORE ================= */
  useEffect(() => {
    // Nếu đang load và bây giờ đã xong load
    if (isLoadingMoreRef.current && !loadingMore) {
      isLoadingMoreRef.current = false;

      // Tính số tin nhắn mới được thêm vào
      const newMessagesCount = messages.length - previousMessagesLengthRef.current;

      if (newMessagesCount > 0) {
        // Điều chỉnh firstItemIndex để giữ scroll position
        setFirstItemIndex((prev) => prev - newMessagesCount);
      }

      previousMessagesLengthRef.current = messages.length;
    }
  }, [loadingMore, messages.length]);

  /** ================= LOAD MORE CALLBACK ================= */
  const handleStartReached = useCallback(() => {
    // Chỉ load khi đã khởi tạo xong
    if (!isInitializedRef.current) return;

    if (hasMore && !isLoadingMoreRef.current) {
      isLoadingMoreRef.current = true;
      dispatch(loadMoreMessages(conversationId));
    } else if (!hasMore && isInitializedRef.current && !hasShownEndToastRef.current) {
      // Hiển thị toast khi đã hết tin nhắn
      hasShownEndToastRef.current = true;
      toast.info("Bạn đã xem hết tin nhắn", {
        duration: 2000,
      });
    }
  }, [hasMore, conversationId, dispatch]);

  /** ================= AUTO SCROLL ON NEW MESSAGE ================= */
  const followOutput = useCallback(
    (isAtBottom: boolean) => {
      if (!isInitializedRef.current) return false;

      const last = messages[messages.length - 1];
      if (!last) return false;

      const isNewMessage = last.id !== latestMessageIdRef.current;

      if (isNewMessage) {
        latestMessageIdRef.current = last.id;
        previousMessagesLengthRef.current = messages.length;

        // Reset toast flag khi có tin nhắn mới
        hasShownEndToastRef.current = false;

        // Nếu là tin nhắn của mình → luôn scroll
        if (last.senderId === currentUser?.id) {
          return "smooth";
        }

        // Nếu là tin nhắn người khác → chỉ scroll khi đang ở bottom
        return isAtBottom ? "smooth" : false;
      }

      return false;
    },
    [messages, currentUser?.id],
  );

  /** ================= TOOLBAR INFO ================= */
  const toolbarInfo = useMemo(() => {
    if (!conversation) {
      return {
        name: "Loading...",
        avatar: undefined,
        status: UserStatus.Offline,
      };
    }

    if (conversation.type === 0) {
      const other = conversation.members.find((m) => m.userId !== currentUser?.id);

      return {
        name: other?.fullName || other?.username || "Unknown",
        avatar: (other?.avatarUrl && IMAGE_DOMAIN + other.avatarUrl) || undefined,
        status: other?.userStatus || UserStatus.Offline,
      };
    }

    return {
      name: conversation.name || "Group Chat",
      avatar: undefined,
      status: UserStatus.Online,
    };
  }, [conversation, currentUser?.id]);

  /** ================= RENDER ================= */
  return (
    <div className="flex h-full gap-4">
      {/* Main chat area - hide on mobile when info panel is open */}
      <div
        className={cn(
          "dark:bg-card flex h-full flex-1 flex-col overflow-hidden rounded-xl bg-white shadow-xl",
          showInfo && "hidden md:flex",
        )}
      >
        <Toolbar
          name={toolbarInfo.name}
          avatar={toolbarInfo.avatar}
          status={toolbarInfo.status}
          setShowInfo={setShowInfo}
        />

        <div className="flex-1 p-3">
          <Virtuoso
            ref={virtuosoRef}
            style={{ height: "100%" }}
            data={messages}
            firstItemIndex={firstItemIndex}
            initialTopMostItemIndex={messages.length > 0 ? firstItemIndex + messages.length - 1 : 0}
            startReached={handleStartReached}
            atTopThreshold={200}
            followOutput={followOutput}
            itemContent={(index, message) => (
              <div className="pb-2">
                <ChatMessage key={message.id} message={message} />
              </div>
            )}
            components={{
              Header: () =>
                !hasMore && messages.length > 0 ? (
                  <div className="flex h-8 items-center justify-center">
                    <span className="text-xs text-gray-400">Khởi đầu cuộc trò chuyện</span>
                  </div>
                ) : null,
            }}
          />
        </div>

        <Footer />
      </div>

      {/* RecipientInfo Panel */}
      {showInfo && (
        <>
          {/* Mobile: Fullscreen overlay */}
          <div className="bg-background fixed inset-0 z-50 md:hidden">
            <RecipientInfo onClose={() => setShowInfo(false)} />
          </div>

          {/* Desktop: Side panel */}
          <div className="hidden transition-all md:block md:w-1/2 lg:w-1/3">
            <RecipientInfo onClose={() => setShowInfo(false)} />
          </div>
        </>
      )}
    </div>
  );
};

export default ChatPage;
