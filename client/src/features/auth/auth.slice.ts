import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ILoginPayload, IRegisterPayload } from "./auth.types";
import { IUser } from "../user/user.types";

interface AuthState {
  loading: boolean;
  user: IUser | null;
  error: string | null;
  loginStatus: "idle" | "loading" | "success" | "error";
  registerStatus: "idle" | "loading" | "success" | "error";
}

const initialState: AuthState = {
  loading: false,
  user: null,
  error: null,
  loginStatus: "idle",
  registerStatus: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    //login
    loginRequest(state, _action: PayloadAction<ILoginPayload>) {
      void _action;
      state.loading = true;
      state.error = null; // clear lỗi cũ
    },
    loginSuccess(state) {
      state.loading = false;
      state.loginStatus = "success";
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.loginStatus = "error";
    },
    resetLoginStatus(state) {
      state.loginStatus = "idle";
    },

    //register
    registerRequest(state, _action: PayloadAction<IRegisterPayload>) {
      void _action;
      state.loading = true;
      state.error = null; // clear lỗi cũ
    },
    registerSuccess(state) {
      state.loading = false;
      state.registerStatus = "success";
    },
    registerFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.registerStatus = "error";
    },
    resetRegisterStatus(state) {
      state.registerStatus = "idle";
    },

    //other
    clearAuthError(state) {
      state.error = null;
    },
    logout() {
      return initialState;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  clearAuthError,
  registerRequest,
  registerSuccess,
  registerFailure,
  resetLoginStatus,
  resetRegisterStatus,
} = authSlice.actions;

export default authSlice.reducer;
