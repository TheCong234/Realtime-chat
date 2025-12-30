import { call, put, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { conversationService } from "./conversation.service";
import { IConversation } from "./conversation.type";
import {
  fetchConversations,
  fetchConversationsFailed,
  fetchConversationsSuccess,
  fetchConversationDetails,
  fetchConversationDetailsSuccess,
  fetchConversationDetailsFailed,
} from "./conversation.slice";
import { IPagedResult } from "@/types/api-response";

function* fetchConversationsSaga() {
  try {
    const response: IPagedResult<IConversation> = yield call(conversationService.getConversations);
    yield put(fetchConversationsSuccess(response.items));
  } catch (error) {
    console.log("Failed to fetch conversations", error);
    yield put(fetchConversationsFailed());
  }
}

function* fetchConversationDetailsSaga(action: PayloadAction<string>) {
  try {
    const conversationId = action.payload;
    const response: IConversation = yield call(conversationService.getConversationById, conversationId);
    yield put(fetchConversationDetailsSuccess(response));
  } catch (error) {
    console.log("Failed to fetch conversation details", error);
    yield put(fetchConversationDetailsFailed());
  }
}

export function* conversationSaga() {
  yield takeLatest(fetchConversations.type, fetchConversationsSaga);
  yield takeLatest(fetchConversationDetails.type, fetchConversationDetailsSaga);
}
