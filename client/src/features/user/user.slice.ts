import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UpdateProfileFormValues } from "./user.schema";

interface UserState {
  error: string | null;

  //api status
  updateProfileStatus: "idle" | "loading" | "success" | "error";
}

const initialState: UserState = {
  error: null,

  updateProfileStatus: "idle",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateProfileRequest(state, _action: PayloadAction<{ values: UpdateProfileFormValues; avatarFile: File | null }>) {
      state.error = null;
      state.updateProfileStatus = "loading";
    },
    updateProfileSuccess(state) {
      state.updateProfileStatus = "success";
    },
    updateProfileFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.updateProfileStatus = "error";
    },
    resetUpdateProfileStatus(state) {
      state.error = null;
      state.updateProfileStatus = "idle";
    },
  },
});

export const { updateProfileRequest, updateProfileSuccess, updateProfileFailure, resetUpdateProfileStatus } =
  userSlice.actions;

export default userSlice.reducer;
