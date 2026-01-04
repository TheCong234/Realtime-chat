import { call, put, select, takeLatest } from "redux-saga/effects";
import { messageService } from "./message.service";
import { IMessage, ISendMessagePayload } from "./message.type";
import {
  fetchMessages,
  fetchMessagesFailed,
  fetchMessagesSuccess,
  sendMessage,
  sendMessageFailed,
  sendMessageSuccess,
  loadMoreMessages,
  loadMoreMessagesSuccess,
  loadMoreMessagesFailed,
} from "./message.slice";
import { PayloadAction } from "@reduxjs/toolkit";
import { IBaseResponse, IMessagePagedResult } from "@/types/api-response";
import { updateConversationLastMessage } from "../conversations/conversation.slice";
import { getErrorMessage } from "@/lib/utils";
import { AxiosError } from "axios";

function* fetchMessagesSaga(action: PayloadAction<string>) {
  try {
    const conversationId = action.payload;
    const response: IBaseResponse<IMessagePagedResult> = yield call(messageService.getMessages, conversationId, 1, 50);
    const hasMore = response.data.pageNumber * response.data.pageSize < response.data.totalCount;
    yield put(fetchMessagesSuccess({ messages: response.data.items, hasMore }));
  } catch (error) {
    yield put(fetchMessagesFailed(getErrorMessage(error)));
  }
}

function* sendMessageSaga(action: PayloadAction<ISendMessagePayload>) {
  try {
    const response: IBaseResponse<IMessage> = yield call(messageService.sendMessage, action.payload);
    yield put(sendMessageSuccess(response.data));
    // Update lastMessage in conversations state
    yield put(updateConversationLastMessage(response.data));
  } catch (error) {
    yield put(sendMessageFailed(getErrorMessage(error)));
  }
}

function* loadMoreMessagesSaga(action: PayloadAction<string>) {
  try {
    const conversationId = action.payload;
    // Get current state to know which page to fetch
    const state: { message: { pageNumber: number } } = yield select((s: { message: { pageNumber: number } }) => s);
    const nextPage = state.message.pageNumber + 1;

    const response: IBaseResponse<IMessagePagedResult> = yield call(
      messageService.getMessages,
      conversationId,
      nextPage,
      50,
    );
    console.log(response);

    const hasMore = response.data.pageNumber * response.data.pageSize < response.data.totalCount;
    yield put(loadMoreMessagesSuccess({ messages: response.data.items, hasMore }));
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    yield put(loadMoreMessagesFailed(getErrorMessage(err)));
  }
}

export function* messageSaga() {
  yield takeLatest(fetchMessages.type, fetchMessagesSaga);
  yield takeLatest(sendMessage.type, sendMessageSaga);
  yield takeLatest(loadMoreMessages.type, loadMoreMessagesSaga);
}
