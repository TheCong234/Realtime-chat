import { axiosClient } from "@/lib/axios";
import { LoginPayload, LoginResponse } from "./auth.types";
import { AUTH_API } from "@/constants/endpoint.api";

export const loginApi = (payload: LoginPayload) => {
  return axiosClient.post<LoginResponse>(AUTH_API.LOGIN, payload);
};
