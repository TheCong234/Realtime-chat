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
  clearHistory,
  clearHistorySuccess,
  clearHistoryFailed,
} from "./conversation.slice";
import { IBaseResponse, IPagedResult } from "@/types/api-response";
import { toast } from "sonner";

function* fetchConversationsSaga() {
  try {
    const response: IBaseResponse<IPagedResult<IConversation>> = yield call(conversationService.getConversations);

    yield put(fetchConversationsSuccess(response.data.items));
  } catch (error) {
    console.log("Failed to fetch conversations", error);
    yield put(fetchConversationsFailed());
  }
}

function* fetchConversationDetailsSaga(action: PayloadAction<string>) {
  try {
    const conversationId = action.payload;
    const response: IBaseResponse<IConversation> = yield call(conversationService.getConversationById, conversationId);
    yield put(fetchConversationDetailsSuccess(response.data));
  } catch (error) {
    console.log("Failed to fetch conversation details", error);
    yield put(fetchConversationDetailsFailed());
  }
}

function* clearHistorySaga(action: PayloadAction<string>) {
  try {
    const conversationId = action.payload;
    yield call(conversationService.clearHistory, conversationId);
    yield put(clearHistorySuccess());
    toast.success("Đã xóa lịch sử chat thành công");
  } catch (error: any) {
    console.log("Failed to clear conversation history", error);
    yield put(clearHistoryFailed());
    toast.error(error?.response?.data?.message || "Xóa lịch sử chat thất bại");
  }
}

export function* conversationSaga() {
  yield takeLatest(fetchConversations.type, fetchConversationsSaga);
  yield takeLatest(fetchConversationDetails.type, fetchConversationDetailsSaga);
  yield takeLatest(clearHistory.type, clearHistorySaga);
}
