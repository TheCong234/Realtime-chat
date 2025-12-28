import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Conversation, ConversationState } from "./conversation.type";

const initialState: ConversationState = {
  conversations: [],
  loading: false,
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    fetchConversations(state) {
      state.loading = true;
    },
    fetchConversationsSuccess(state, action: PayloadAction<Conversation[]>) {
      state.loading = false;
      state.conversations = action.payload;
    },
    fetchConversationsFailed(state) {
      state.loading = false;
    },
  },
});

export const { fetchConversations, fetchConversationsSuccess, fetchConversationsFailed } = conversationSlice.actions;
export default conversationSlice.reducer;
