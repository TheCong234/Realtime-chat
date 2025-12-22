import { call, put, takeLatest } from "redux-saga/effects";
import { getMeApi, loginApi, registerApi } from "./auth.api";
import {
  getMeFailure,
  getMeRequest,
  getMeSuccess,
  loginFailure,
  loginRequest,
  loginSuccess,
  registerFailure,
  registerRequest,
  registerSuccess,
} from "./auth.slice";
import { IAuthResponse } from "./auth.types";
import { IUser } from "../user/user.types";

function* handleLogin(action: ReturnType<typeof loginRequest>) {
  try {
    const response: IAuthResponse = yield call(loginApi, action.payload);

    // lưu token (demo)
    localStorage.setItem("accessToken", response.accessToken);

    yield put(loginSuccess());
  } catch (error: any) {
    yield put(loginFailure(error.message));
  }
}

function* handleRegister(action: ReturnType<typeof registerRequest>) {
  try {
    const response: IAuthResponse = yield call(registerApi, action.payload);

    // lưu token (demo)
    localStorage.setItem("accessToken", response.accessToken);

    yield put(registerSuccess());
  } catch (error: any) {
    yield put(registerFailure(error.message));
  }
}

function* handleGetMe(action: ReturnType<typeof getMeRequest>) {
  try {
    const response: IUser = yield call(getMeApi, action.payload);
    yield put(getMeSuccess(response));
  } catch (error: any) {
    yield put(getMeFailure(error.message));
  }
}

export function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(registerRequest.type, handleRegister);
  yield takeLatest(getMeRequest.type, handleGetMe);
}
