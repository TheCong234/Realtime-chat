import { axiosClient } from "@/lib/axios";
import { LoginPayload, AuthResponse, RegisterPayload } from "./auth.types";
import { AUTH_API } from "@/constants/endpoint.api";

export const loginApi = (payload: LoginPayload) => {
  return axiosClient.post<AuthResponse>(AUTH_API.LOGIN, payload);
};

export const registerApi = (payload: RegisterPayload) => {
  return axiosClient.post<AuthResponse>(AUTH_API.REGISTER, payload);
};
