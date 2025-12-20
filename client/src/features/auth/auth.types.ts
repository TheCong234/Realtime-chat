export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ILoginPayload {
  usernameOrEmail: string;
  password: string;
}

export interface IRegisterPayload {
  username: string;
  fullName: string;
  email: string;
  password: string;
}
