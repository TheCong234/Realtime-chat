import { all } from "redux-saga/effects";
import { authSaga } from "@/features/auth/auth.saga";
import { conversationSaga } from "@/features/conversations/conversation.saga";
import { messageSaga } from "@/features/messages/message.saga";

export default function* rootSaga() {
  yield all([authSaga(), conversationSaga(), messageSaga()]);
}
