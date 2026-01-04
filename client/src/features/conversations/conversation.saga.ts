import { call, put, takeLatest, select } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { conversationService } from "./conversation.service";
import { IConversation } from "./conversation.type";
import {
  fetchConversations,
  fetchConversationsFailed,
  fetchConversationsSuccess,
  loadMoreConversations,
  loadMoreConversationsSuccess,
  loadMoreConversationsFailed,
  fetchConversationDetails,
  fetchConversationDetailsSuccess,
  fetchConversationDetailsFailed,
  clearHistory,
  clearHistorySuccess,
  clearHistoryFailed,
} from "./conversation.slice";
import { IBaseResponse, IPagedResult } from "@/types/api-response";
import { toast } from "sonner";
import { RootState } from "@/store";
import { getErrorMessage } from "@/lib/utils";

function* fetchConversationsSaga(action: PayloadAction<string | undefined>) {
  try {
    const searchQuery = action.payload;
    const response: IBaseResponse<IPagedResult<IConversation>> = yield call(
      conversationService.getConversations,
      searchQuery,
      1,
    );

    yield put(
      fetchConversationsSuccess({
        items: response.data.items,
        hasMore: response.data.hasNextPage,
      }),
    );
  } catch (error) {
    console.log("Failed to fetch conversations", error);
    yield put(fetchConversationsFailed());
  }
}

function* loadMoreConversationsSaga() {
  try {
    const state: RootState = yield select();
    const { pageNumber, searchQuery } = state.conversation;

    const response: IBaseResponse<IPagedResult<IConversation>> = yield call(
      conversationService.getConversations,
      searchQuery,
      pageNumber + 1,
    );

    yield put(
      loadMoreConversationsSuccess({
        items: response.data.items,
        hasMore: response.data.hasNextPage,
        pageNumber: response.data.pageNumber,
      }),
    );
  } catch (error) {
    console.log("Failed to load more conversations", error);
    yield put(loadMoreConversationsFailed());
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
    yield put(clearHistorySuccess(conversationId));
    toast.success("Đã xóa cuộc hội thoại thành công");
  } catch (error) {
    const message = getErrorMessage(error);
    yield put(clearHistoryFailed());
    toast.error(message);
  }
}

export function* conversationSaga() {
  yield takeLatest(fetchConversations.type, fetchConversationsSaga);
  yield takeLatest(loadMoreConversations.type, loadMoreConversationsSaga);
  yield takeLatest(fetchConversationDetails.type, fetchConversationDetailsSaga);
  yield takeLatest(clearHistory.type, clearHistorySaga);
}
