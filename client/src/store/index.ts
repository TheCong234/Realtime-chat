import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import authReducer from "@/features/auth/auth.slice";
import conversationReducer from "@/features/conversations/conversation.slice";
import rootSaga from "./rootSaga";

import messageReducer from "@/features/messages/message.slice";
import userReducer from "@/features/user/user.slice";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    conversation: conversationReducer,
    message: messageReducer,
    user: userReducer,
  },
  middleware: (gDM) =>
    gDM({
      thunk: false,
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["user/updateProfileRequest"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["payload.avatarFile"],
      },
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks for use throughout the app
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
