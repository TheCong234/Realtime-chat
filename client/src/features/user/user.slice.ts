import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UpdateProfileFormValues } from "./user.schema";
import { IUser } from "./user.types";

interface UserState {
  loading: boolean;
  currentUser: IUser | null;
  error: string | null;

  //api status
  updateProfileStatus: "idle" | "loading" | "success" | "error";
  getMeStatus: "idle" | "loading" | "success" | "error";
}

const initialState: UserState = {
  loading: false,
  currentUser: null,
  error: null,

  updateProfileStatus: "idle",
  getMeStatus: "idle",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateProfileRequest(state, _action: PayloadAction<{ values: UpdateProfileFormValues; avatarFile: File | null }>) {
      state.error = null;
      state.updateProfileStatus = "loading";
    },
    updateProfileSuccess(state, action: PayloadAction<IUser>) {
      state.updateProfileStatus = "success";
      state.currentUser = action.payload;
    },
    updateProfileFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.updateProfileStatus = "error";
    },
    resetUpdateProfileStatus(state) {
      state.error = null;
      state.updateProfileStatus = "idle";
    },

    //get me
    getMeRequest(state, _action: PayloadAction<string>) {
      state.loading = true;
      state.error = null; // clear lỗi cũ
    },
    getMeSuccess(state, action: PayloadAction<IUser>) {
      state.loading = false;
      state.currentUser = action.payload;
      state.getMeStatus = "success";
    },
    getMeFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.getMeStatus = "error";
    },
  },
});

export const {
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFailure,
  resetUpdateProfileStatus,
  getMeRequest,
  getMeSuccess,
  getMeFailure,
} = userSlice.actions;

export default userSlice.reducer;
