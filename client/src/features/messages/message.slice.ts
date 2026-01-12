import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMessage, ISendMessagePayload, IRecallMessagePayload } from "./message.type";
import { MessageReadStatus } from "@/constants/enum";

interface IMessageState {
  messages: IMessage[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  pageNumber: number;
}

const initialState: IMessageState = {
  messages: [],
  loading: false,
  loadingMore: false,
  error: null,
  hasMore: true,
  pageNumber: 1,
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    fetchMessages(state, _action: PayloadAction<string>) {
      state.loading = true;
      state.error = null;
    },
    fetchMessagesSuccess(state, action: PayloadAction<{ messages: IMessage[]; hasMore: boolean }>) {
      state.loading = false;
      state.messages = action.payload.messages.reverse();
      state.hasMore = action.payload.hasMore;
      state.pageNumber = 1;
    },
    fetchMessagesFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    resetMessages(state) {
      state.messages = [];
      state.error = null;
      state.hasMore = true;
      state.pageNumber = 1;
    },

    // Send Message Actions
    sendMessage(state, _action: PayloadAction<ISendMessagePayload>) {
      state.loading = true;
      state.error = null;
    },
    // Optimistic: add message with Sending status immediately
    addOptimisticMessage(state, action: PayloadAction<IMessage>) {
      state.messages.push(action.payload);
    },
    sendMessageSuccess(state, action: PayloadAction<IMessage>) {
      state.loading = false;
      // Update the optimistic message with real data from server
      const index = state.messages.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) {
        state.messages[index] = {
          ...action.payload,
          status: state.messages[index].status,
        };
      } else {
        state.messages.push(action.payload);
      }
    },
    sendMessageFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Load More Messages Actions
    loadMoreMessages(state, _action: PayloadAction<string>) {
      state.loadingMore = true;
      state.error = null;
    },
    loadMoreMessagesSuccess(state, action: PayloadAction<{ messages: IMessage[]; hasMore: boolean }>) {
      state.loadingMore = false;
      // Prepend older messages to the beginning
      state.messages = action.payload.messages.reverse().concat(state.messages);
      state.hasMore = action.payload.hasMore;
      state.pageNumber += 1;
    },
    loadMoreMessagesFailed(state, action: PayloadAction<string>) {
      state.loadingMore = false;
      state.error = action.payload;
    },

    // Real-time message updates
    receiveMessage(state, action: PayloadAction<IMessage>) {
      // Only add if not already exists (avoid duplicates)
      const exists = state.messages.some((m) => m.id === action.payload.id);
      if (!exists) {
        state.messages.push(action.payload);
      }
    },
    updateMessageStatus(
      state,
      action: PayloadAction<{ messageId: string; conversationId: string; status: MessageReadStatus }>,
    ) {
      if (state.messages.length === 0) return;
      if (action.payload.conversationId !== state.messages[0].conversationId) return;

      const message = state.messages.find((m) => m.id === action.payload.messageId);
      console.log("Found message:", message ? message.status : "NOT FOUND");

      if (message) {
        message.status = action.payload.status;
      }
    },
    // Mark all messages in current conversation as seen (for sender's perspective)
    markAllAsSeen(state, action: PayloadAction<{ conversationId: string; userId: string }>) {
      state.messages.forEach((m) => {
        // Only update messages sent by the viewer (not their own messages)
        if (m.conversationId === action.payload.conversationId && m.senderId !== action.payload.userId) {
          m.status = MessageReadStatus.Seen;
        }
      });
    },
    // Mark all messages in conversation as delivered (sender's perspective when recipient comes online)
    markAllAsDelivered(state, action: PayloadAction<{ conversationId: string; userId: string }>) {
      state.messages.forEach((m) => {
        // Update messages sent by the current user (sender) to the user who just came online
        // Only update if current status is Sent
        if (
          m.conversationId === action.payload.conversationId &&
          m.senderId !== action.payload.userId &&
          m.status === MessageReadStatus.Sent
        ) {
          m.status = MessageReadStatus.Delivered;
        }
      });
    },

    // Recall Message Actions
    recallMessage(state, _action: PayloadAction<IRecallMessagePayload>) {
      state.loading = true;
      state.error = null;
    },
    recallMessageSuccess(state, action: PayloadAction<string>) {
      state.loading = false;
      const message = state.messages.find((m) => m.id === action.payload);
      if (message) {
        message.isDeleted = true;
        message.status = MessageReadStatus.Recalled;
        message.content = "Tin nhắn đã được thu hồi";
      }
    },
    recallMessageFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Real-time recall notification (from SignalR)
    messageRecalled(state, action: PayloadAction<{ messageId: string }>) {
      const message = state.messages.find((m) => m.id === action.payload.messageId);
      if (message) {
        message.isDeleted = true;
        message.status = MessageReadStatus.Recalled;
        message.content = "Tin nhắn đã được thu hồi";
      }
    },
  },
});

export const {
  fetchMessages,
  fetchMessagesSuccess,
  fetchMessagesFailed,
  resetMessages,
  sendMessage,
  sendMessageSuccess,
  sendMessageFailed,
  loadMoreMessages,
  loadMoreMessagesSuccess,
  loadMoreMessagesFailed,
  receiveMessage,
  updateMessageStatus,
  markAllAsSeen,
  markAllAsDelivered,
  addOptimisticMessage,
  recallMessage,
  recallMessageSuccess,
  recallMessageFailed,
  messageRecalled,
} = messageSlice.actions;
export default messageSlice.reducer;
