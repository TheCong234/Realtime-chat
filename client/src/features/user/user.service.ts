import { axiosClient } from "@/lib/axios";
import { IUser } from "./user.types";
import { IBaseResponse } from "@/types/api-response";
import { USER_API } from "@/constants/endpoint.api";

export const userService = {
  updateProfile: async (data: FormData, avatarFile: File | null): Promise<IBaseResponse<IUser>> => {
    const formData = new FormData();
    if (data.get("fullName")) formData.append("fullName", data.get("fullName") as string);
    if (data.get("phoneNumber")) formData.append("phoneNumber", data.get("phoneNumber") as string);
    if (avatarFile) formData.append("avatarFile", avatarFile);

    return await axiosClient.put(USER_API.UPDATE_PROFILE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
  },
};
