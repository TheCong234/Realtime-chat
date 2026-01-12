import { call, put, select, takeLatest } from "redux-saga/effects";
import { messageService } from "./message.service";
import { IMessage, ISendMessagePayload, IRecallMessagePayload } from "./message.type";
import {
  fetchMessages,
  fetchMessagesFailed,
  fetchMessagesSuccess,
  sendMessage,
  sendMessageFailed,
  sendMessageSuccess,
  addOptimisticMessage,
  loadMoreMessages,
  loadMoreMessagesSuccess,
  loadMoreMessagesFailed,
  recallMessage,
  recallMessageSuccess,
  recallMessageFailed,
} from "./message.slice";
import { PayloadAction } from "@reduxjs/toolkit";
import { IBaseResponse, IMessagePagedResult } from "@/types/api-response";
import { updateConversationLastMessage } from "../conversations/conversation.slice";
import { getErrorMessage } from "@/lib/utils";
import { AxiosError } from "axios";
import { MessageReadStatus, MessageType } from "@/constants/enum";

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
    // Get current user from user state
    const userState: {
      user: {
        currentUser: {
          id: string;
          username: string;
          fullName: string | null;
          email: string;
          avatarUrl: string | null;
        } | null;
      };
    } = yield select((s) => s);
    const currentUser = userState.user.currentUser;

    if (!currentUser) {
      yield put(sendMessageFailed("User not logged in"));
      return;
    }

    // Create optimistic message with client-generated ID
    const optimisticMessage: IMessage = {
      id: action.payload.id,
      conversationId: action.payload.conversationId,
      senderId: currentUser.id,
      type: action.payload.type as MessageType,
      content: action.payload.content,
      createdAt: new Date().toISOString(),
      isDeleted: false,
      status: MessageReadStatus.Sent,
      sender: {
        id: currentUser.id,
        username: currentUser.username,
        fullName: currentUser.fullName,
        email: currentUser.email,
        phoneNumber: null,
        emailConfirmed: true,
        phoneConfirmed: false,
        createdAt: new Date().toISOString(),
        lastOnlineAt: null,
        avatarUrl: currentUser.avatarUrl,
        status: 1,
        isActive: true,
        role: "User",
      },
    };

    // Add message to state immediately (optimistic update)
    yield put(addOptimisticMessage(optimisticMessage));

    // Call API
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

    const hasMore = response.data.pageNumber * response.data.pageSize < response.data.totalCount;
    yield put(loadMoreMessagesSuccess({ messages: response.data.items, hasMore }));
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    yield put(loadMoreMessagesFailed(getErrorMessage(err)));
  }
}

function* recallMessageSaga(action: PayloadAction<IRecallMessagePayload>) {
  try {
    yield call(messageService.recallMessage, action.payload.messageId);
    yield put(recallMessageSuccess(action.payload.messageId));
  } catch (error) {
    yield put(recallMessageFailed(getErrorMessage(error)));
  }
}

export function* messageSaga() {
  yield takeLatest(fetchMessages.type, fetchMessagesSaga);
  yield takeLatest(sendMessage.type, sendMessageSaga);
  yield takeLatest(loadMoreMessages.type, loadMoreMessagesSaga);
  yield takeLatest(recallMessage.type, recallMessageSaga);
}
