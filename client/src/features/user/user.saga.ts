import { call, put, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  updateProfileFailure,
  updateProfileRequest,
  updateProfileSuccess,
  getMeRequest,
  getMeSuccess,
  getMeFailure,
} from "./user.slice";
import { userService } from "./user.service";
import { toast } from "sonner";
import { IBaseResponse } from "@/types/api-response";
import { IUser } from "./user.types";
import { UpdateProfileFormValues } from "./user.schema";
import { getErrorMessage } from "@/lib/utils";

function* handleUpdateProfile(action: PayloadAction<{ values: UpdateProfileFormValues; avatarFile: File | null }>) {
  try {
    const { values, avatarFile } = action.payload;
    const formData = new FormData();
    formData.append("fullName", values.fullName);
    formData.append("phoneNumber", values.phoneNumber);
    if (avatarFile) formData.append("avatarFile", avatarFile);

    const response: IBaseResponse<IUser> = yield call(userService.updateProfile, formData, avatarFile);

    yield put(updateProfileSuccess(response.data));
    toast.success(response.message || "Cập nhật hồ sơ thành công");
  } catch (error) {
    const message = getErrorMessage(error);
    yield put(updateProfileFailure(message));
    toast.error(message);
  }
}

function* handleGetMe(action: ReturnType<typeof getMeRequest>) {
  try {
    const response: IBaseResponse<IUser> = yield call(userService.getMe, action.payload);
    toast.success(response.message || "Lấy thông tin người dùng thành công");
    yield put(getMeSuccess(response.data));
  } catch (error) {
    const message = getErrorMessage(error);
    toast.error(message);
    yield put(getMeFailure(message));
  }
}

export function* userSaga() {
  yield takeLatest(updateProfileRequest.type, handleUpdateProfile);
  yield takeLatest(getMeRequest.type, handleGetMe);
}
