import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoginPayload, User } from "./auth.types";

interface AuthState {
  loading: boolean;
  user: User | null;
  accessToken: string | null;
  error: string | null;
}

const initialState: AuthState = {
  loading: false,
  user: null,
  accessToken: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest(state, _action: PayloadAction<LoginPayload>) {
      state.loading = true;
      state.error = null; // clear lỗi cũ
    },
    loginSuccess(state, action: PayloadAction<{ accessToken: string }>) {
      state.loading = false;
      state.accessToken = action.payload.accessToken;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    logout() {
      return initialState;
    },
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout } = authSlice.actions;

export default authSlice.reducer;
