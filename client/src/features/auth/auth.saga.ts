import { call, put, takeLatest } from "redux-saga/effects";
import { authService } from "./auth.service";
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
import { toast } from "sonner";

function* handleLogin(action: ReturnType<typeof loginRequest>) {
  try {
    const response: IAuthResponse = yield call(authService.login, action.payload);

    // lưu token (demo)
    localStorage.setItem("accessToken", response.accessToken);

    yield put(loginSuccess());
    toast.success("Đăng nhập thành công");
  } catch (error: any) {
    yield put(loginFailure(error.message));
    toast.error(error.message || "Đăng nhập thất bại");
  }
}

function* handleRegister(action: ReturnType<typeof registerRequest>) {
  try {
    const response: IAuthResponse = yield call(authService.register, action.payload);

    // lưu token (demo)
    localStorage.setItem("accessToken", response.accessToken);

    yield put(registerSuccess());
    toast.success("Đăng ký thành công");
  } catch (error: any) {
    yield put(registerFailure(error.message));
    toast.error(error.message || "Đăng ký thất bại");
  }
}

function* handleGetMe(action: ReturnType<typeof getMeRequest>) {
  try {
    const response: IUser = yield call(authService.getMe, action.payload);
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
