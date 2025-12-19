export interface User {
  id: number;
  email: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  usernameOrEmail: string;
  password: string;
}
