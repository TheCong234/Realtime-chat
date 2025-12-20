import { call, put, takeLatest } from "redux-saga/effects";
import { loginApi, registerApi } from "./auth.api";
import {
  loginFailure,
  loginRequest,
  loginSuccess,
  registerFailure,
  registerRequest,
  registerSuccess,
} from "./auth.slice";
import { AuthResponse } from "./auth.types";

function* handleLogin(action: ReturnType<typeof loginRequest>) {
  try {
    const response: AuthResponse = yield call(loginApi, action.payload);

    // lưu token (demo)
    localStorage.setItem("accessToken", response.accessToken);

    yield put(loginSuccess());
  } catch (error: any) {
    yield put(loginFailure(error.message));
  }
}

function* handleRegister(action: ReturnType<typeof registerRequest>) {
  try {
    const response: AuthResponse = yield call(registerApi, action.payload);

    // lưu token (demo)
    localStorage.setItem("accessToken", response.accessToken);

    yield put(registerSuccess());
  } catch (error: any) {
    yield put(registerFailure(error.message));
  }
}

export function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(registerRequest.type, handleRegister);
}
