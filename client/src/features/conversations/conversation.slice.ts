import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IConversation, IConversationState } from "./conversation.type";

const initialState: IConversationState = {
  conversations: [],
  conversation: null,
  loading: false,
  searchQuery: "",
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    fetchConversations(state, action: PayloadAction<string | undefined>) {
      state.loading = true;
      state.searchQuery = action.payload || "";
    },
    fetchConversationsSuccess(state, action: PayloadAction<IConversation[]>) {
      state.loading = false;
      state.conversations = action.payload;
    },
    fetchConversationsFailed(state) {
      state.loading = false;
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
    clearHistorySuccess(state) {
      state.loading = false;
    },
    clearHistoryFailed(state) {
      state.loading = false;
    },
  },
});

export const {
  fetchConversations,
  fetchConversationsSuccess,
  fetchConversationsFailed,
  fetchConversationDetails,
  fetchConversationDetailsSuccess,
  fetchConversationDetailsFailed,
  clearHistory,
  clearHistorySuccess,
  clearHistoryFailed,
} = conversationSlice.actions;
export default conversationSlice.reducer;
