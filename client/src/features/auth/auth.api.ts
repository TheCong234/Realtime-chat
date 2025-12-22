import { axiosClient } from "@/lib/axios";
import { ILoginPayload, IAuthResponse, IRegisterPayload } from "./auth.types";
import { AUTH_API } from "@/constants/endpoint.api";
import { IUser } from "../user/user.types";

export const loginApi = (payload: ILoginPayload) => {
  return axiosClient.post<IAuthResponse>(AUTH_API.LOGIN, payload);
};

export const registerApi = (payload: IRegisterPayload) => {
  return axiosClient.post<IAuthResponse>(AUTH_API.REGISTER, payload);
};

export const getMeApi = (payload: string) => {
  return axiosClient.get<IUser>(AUTH_API.GET_ME, {
    headers: {
      Authorization: `Bearer ${payload}`,
    },
  });
};
