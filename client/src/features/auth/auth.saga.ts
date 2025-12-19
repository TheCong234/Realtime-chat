import { call, put, takeLatest } from "redux-saga/effects";
import { loginApi } from "./auth.api";
import { loginFailure, loginRequest, loginSuccess } from "./auth.slice";
import { LoginResponse } from "./auth.types";

function* handleLogin(action: ReturnType<typeof loginRequest>) {
  try {
    const response: LoginResponse = yield call(loginApi, action.payload);

    // lưu token (demo)
    localStorage.setItem("accessToken", response.accessToken);

    yield put(
      loginSuccess({
        accessToken: response.accessToken,
      }),
    );
  } catch (error: any) {
    yield put(loginFailure(error.message));
  }
}

export function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
}
