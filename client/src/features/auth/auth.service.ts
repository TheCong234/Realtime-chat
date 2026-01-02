import { axiosClient } from "@/lib/axios";
import { ILoginPayload, IAuthResponse, IRegisterPayload } from "./auth.types";
import { IBaseResponse } from "@/types/api-response";
import { AUTH_API } from "@/constants/endpoint.api";

export const authService = {
  login: (payload: ILoginPayload) => {
    return axiosClient.post<IBaseResponse<IAuthResponse>>(AUTH_API.LOGIN, payload);
  },
  register: (payload: IRegisterPayload) => {
    return axiosClient.post<IBaseResponse<IAuthResponse>>(AUTH_API.REGISTER, payload);
  },
};
