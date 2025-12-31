import { call, put, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { updateProfileFailure, updateProfileRequest, updateProfileSuccess } from "./user.slice";
import { userService } from "./user.service";
import { getMeSuccess } from "../auth/auth.slice";
import { toast } from "sonner";
import { IBaseResponse } from "@/types/api-response";
import { IUser } from "./user.types";
import { UpdateProfileFormValues } from "./user.schema";

function* handleUpdateProfile(action: PayloadAction<{ values: UpdateProfileFormValues; avatarFile: File | null }>) {
  try {
    const { values, avatarFile } = action.payload;
    const formData = new FormData();
    formData.append("fullName", values.fullName);
    formData.append("phoneNumber", values.phoneNumber);
    if (avatarFile) formData.append("avatarFile", avatarFile);

    const response: IBaseResponse<IUser> = yield call(userService.updateProfile, formData, avatarFile);

    yield put(updateProfileSuccess());
    yield put(getMeSuccess(response.data));
    toast.success(response.message || "Cập nhật hồ sơ thành công");
  } catch (error: any) {
    const message = error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật hồ sơ";
    yield put(updateProfileFailure(message));
    toast.error(message);
  }
}

export function* userSaga() {
  yield takeLatest(updateProfileRequest.type, handleUpdateProfile);
}
