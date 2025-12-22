import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ILoginPayload, IRegisterPayload } from "./auth.types";
import { IUser } from "../user/user.types";

interface AuthState {
  loading: boolean;
  user: IUser | null;
  error: string | null;
  loginStatus: "idle" | "loading" | "success" | "error";
  registerStatus: "idle" | "loading" | "success" | "error";
  getMeStatus: "idle" | "loading" | "success" | "error";
}

const initialState: AuthState = {
  loading: false,
  user: null,
  error: null,
  loginStatus: "idle",
  registerStatus: "idle",
  getMeStatus: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    //login
    loginRequest(state, _action: PayloadAction<ILoginPayload>) {
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

    //get me
    getMeRequest(state, _action: PayloadAction<string>) {
      state.loading = true;
      state.error = null; // clear lỗi cũ
    },
    getMeSuccess(state, action: PayloadAction<IUser>) {
      state.loading = false;
      state.user = action.payload;
      state.getMeStatus = "success";
    },
    getMeFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.getMeStatus = "error";
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
  getMeRequest,
  getMeSuccess,
  getMeFailure,
} = authSlice.actions;

export default authSlice.reducer;
