import { call, put, takeLatest } from "redux-saga/effects";
import { messageService } from "./message.service";
import { Message, SendMessagePayload } from "./message.type";
import {
  fetchMessages,
  fetchMessagesFailed,
  fetchMessagesSuccess,
  sendMessage,
  sendMessageFailed,
  sendMessageSuccess,
} from "./message.slice";
import { PayloadAction } from "@reduxjs/toolkit";
import { MessagePagedResult } from "@/types/api-response";

function* fetchMessagesSaga(action: PayloadAction<string>) {
  try {
    const conversationId = action.payload;
    const response: MessagePagedResult = yield call(messageService.getMessages, conversationId);
    yield put(fetchMessagesSuccess(response.items));
  } catch (error: any) {
    console.log("Failed to fetch messages", error);
    yield put(fetchMessagesFailed(error?.message || "Failed to fetch messages"));
  }
}

function* sendMessageSaga(action: PayloadAction<SendMessagePayload>) {
  try {
    const response: Message = yield call(messageService.sendMessage, action.payload);
    yield put(sendMessageSuccess(response));
  } catch (error: any) {
    console.log("Failed to send message", error);
    yield put(sendMessageFailed(error?.message || "Failed to send message"));
  }
}

export function* messageSaga() {
  yield takeLatest(fetchMessages.type, fetchMessagesSaga);
  yield takeLatest(sendMessage.type, sendMessageSaga);
}
