import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import authReducer from "@/features/auth/auth.slice";
import conversationReducer from "@/features/conversations/conversation.slice";
import rootSaga from "./rootSaga";

import messageReducer from "@/features/messages/message.slice";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    conversation: conversationReducer,
    message: messageReducer,
  },
  middleware: (gDM) => gDM({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
