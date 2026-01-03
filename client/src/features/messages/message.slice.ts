import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMessage, ISendMessagePayload } from "./message.type";
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
    sendMessageSuccess(state, action: PayloadAction<IMessage>) {
      state.loading = false;
      state.messages = state.messages.concat(action.payload);
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
    updateMessageStatus(state, action: PayloadAction<{ messageId: string; status: MessageReadStatus }>) {
      const message = state.messages.find((m) => m.id === action.payload.messageId);
      if (message) {
        message.status = action.payload.status;
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
} = messageSlice.actions;
export default messageSlice.reducer;
