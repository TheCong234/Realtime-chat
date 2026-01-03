import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IConversation, IConversationState } from "./conversation.type";
import { IMessage } from "../messages/message.type";

const initialState: IConversationState = {
  conversations: [],
  conversation: null,
  loading: false,
  searchQuery: "",
  hasMore: true,
  loadingMore: false,
  pageNumber: 1,
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    fetchConversations(state, action: PayloadAction<string | undefined>) {
      state.loading = true;
      state.searchQuery = action.payload || "";
      state.pageNumber = 1;
      state.hasMore = true;
    },
    fetchConversationsSuccess(state, action: PayloadAction<{ items: IConversation[]; hasMore: boolean }>) {
      state.loading = false;
      state.conversations = action.payload.items;
      state.hasMore = action.payload.hasMore;
    },
    fetchConversationsFailed(state) {
      state.loading = false;
    },

    loadMoreConversations(state) {
      state.loadingMore = true;
    },
    loadMoreConversationsSuccess(
      state,
      action: PayloadAction<{ items: IConversation[]; hasMore: boolean; pageNumber: number }>,
    ) {
      state.loadingMore = false;
      state.conversations = [...state.conversations, ...action.payload.items];
      state.hasMore = action.payload.hasMore;
      state.pageNumber = action.payload.pageNumber;
    },
    loadMoreConversationsFailed(state) {
      state.loadingMore = false;
    },

    //get conversation details
    fetchConversationDetails(state, action: PayloadAction<string>) {
      state.loading = true;
    },
    fetchConversationDetailsSuccess(state, action: PayloadAction<IConversation>) {
      state.loading = false;
      state.conversation = action.payload;
    },
    fetchConversationDetailsFailed(state) {
      state.loading = false;
    },

    // Clear conversation history
    clearHistory(state, action: PayloadAction<string>) {
      state.loading = true;
    },
    clearHistorySuccess(state, action: PayloadAction<string>) {
      state.loading = false;
      state.conversations = state.conversations.filter((conv) => conv.id !== action.payload);
    },
    clearHistoryFailed(state) {
      state.loading = false;
    },

    // Update conversation last message
    updateConversationLastMessage(state, action: PayloadAction<IMessage>) {
      const message = action.payload;
      const conversationIndex = state.conversations.findIndex((conv) => conv.id === message.conversationId);

      if (conversationIndex !== -1) {
        // Update lastMessage
        state.conversations[conversationIndex].lastMessage = message;

        // Move conversation to the top of the list
        const [updatedConversation] = state.conversations.splice(conversationIndex, 1);
        state.conversations.unshift(updatedConversation);
      }

      // Also update current conversation if it matches
      if (state.conversation && state.conversation.id === message.conversationId) {
        state.conversation.lastMessage = message;
      }
    },
  },
});

export const {
  fetchConversations,
  fetchConversationsSuccess,
  fetchConversationsFailed,
  loadMoreConversations,
  loadMoreConversationsSuccess,
  loadMoreConversationsFailed,
  fetchConversationDetails,
  fetchConversationDetailsSuccess,
  fetchConversationDetailsFailed,
  clearHistory,
  clearHistorySuccess,
  clearHistoryFailed,
  updateConversationLastMessage,
} = conversationSlice.actions;
export default conversationSlice.reducer;
