import { call, put, takeLatest } from "redux-saga/effects";
import { conversationService } from "./conversation.service";
import { IConversation } from "./conversation.type";
import { fetchConversations, fetchConversationsFailed, fetchConversationsSuccess } from "./conversation.slice";
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

export function* conversationSaga() {
  yield takeLatest(fetchConversations.type, fetchConversationsSaga);
}
