import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IConversation, IConversationState } from "./conversation.type";

const initialState: IConversationState = {
  conversations: [],
  conversation: null,
  loading: false,
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    fetchConversations(state) {
      state.loading = true;
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
  },
});

export const {
  fetchConversations,
  fetchConversationsSuccess,
  fetchConversationsFailed,
  fetchConversationDetails,
  fetchConversationDetailsSuccess,
  fetchConversationDetailsFailed,
} = conversationSlice.actions;
export default conversationSlice.reducer;
