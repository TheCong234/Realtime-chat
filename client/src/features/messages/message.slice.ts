import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message, SendMessagePayload } from "./message.type";

interface MessageState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

const initialState: MessageState = {
  messages: [],
  loading: false,
  error: null,
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    fetchMessages(state, _action: PayloadAction<string>) {
      state.loading = true;
      state.error = null;
    },
    fetchMessagesSuccess(state, action: PayloadAction<Message[]>) {
      state.loading = false;
      state.messages = action.payload.reverse();
    },
    fetchMessagesFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    resetMessages(state) {
      state.messages = [];
      state.error = null;
    },

    // Send Message Actions
    sendMessage(state, _action: PayloadAction<SendMessagePayload>) {
      state.loading = true;
      state.error = null;
    },
    sendMessageSuccess(state, action: PayloadAction<Message>) {
      state.loading = false;
      state.messages = state.messages.concat(action.payload);
    },
    sendMessageFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
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
} = messageSlice.actions;
export default messageSlice.reducer;
