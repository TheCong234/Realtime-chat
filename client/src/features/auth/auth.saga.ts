import { call, put, takeLatest } from "redux-saga/effects";
import { authService } from "./auth.service";
import {
  loginFailure,
  loginRequest,
  loginSuccess,
  registerFailure,
  registerRequest,
  registerSuccess,
} from "./auth.slice";
import { IAuthResponse } from "./auth.types";
import { toast } from "sonner";
import { IBaseResponse } from "@/types/api-response";
import { getErrorMessage } from "@/lib/utils";

function* handleLogin(action: ReturnType<typeof loginRequest>) {
  try {
    const response: IBaseResponse<IAuthResponse> = yield call(authService.login, action.payload);

    // lưu token (demo)
    localStorage.setItem("accessToken", response.data.accessToken);

    yield put(loginSuccess());
    toast.success("Đăng nhập thành công");
  } catch (error) {
    const message = getErrorMessage(error);
    yield put(loginFailure(message));
    toast.error(message);
  }
}

function* handleRegister(action: ReturnType<typeof registerRequest>) {
  try {
    const response: IBaseResponse<IAuthResponse> = yield call(authService.register, action.payload);

    // lưu token (demo)
    localStorage.setItem("accessToken", response.data.accessToken);

    yield put(registerSuccess());
    toast.success("Đăng ký thành công");
  } catch (error) {
    const message = getErrorMessage(error);
    yield put(registerFailure(message));
    toast.error(message);
  }
}

export function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(registerRequest.type, handleRegister);
}
