import { Maybe } from "yup";

export interface User {
  id: number;
  email: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  fullName: string;
  email: string;
  password: string;
}
