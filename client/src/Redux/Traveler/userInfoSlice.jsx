import { createSlice } from "@reduxjs/toolkit";
import {
  changeEmail,
  changePassword,
  sentOTP,
  verifyOtp,
} from "../../Features/UserManagementFeature";

const initialState = {
  activePanel: null,
  isLoading: false,
  error: null,
  isPasswordChanged: false,
  isEmailChanged: false,
  showEditPanel: false,
  userOTP: {
    isSentOtp: false,
    isVerifiedOtp: false,
  },
};

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    showActivePanel: (state, action) => {
      state.activePanel = action.payload;
    },
    hideActivePanel: (state) => {
      state.activePanel = null;
    },

    showEditOptionPanel: (state, action) => {
      state.showEditPanel = true;
    },

    hideEditOptionPanel: (state) => {
      state.showEditPanel = false;
    },

    resetPreviosSession: (state) => {
      state.userOTP.isSentOtp = false;
      state.userOTP.isVerifiedOtp = false;
      state.isPasswordChanged = false;
      state.isEmailChanged = false;
    },
  },

  extraReducers: (builder) => {
    // otp section

    builder.addCase(sentOTP.pending, (state) => {
      state.isLoading = true;
      state.userOTP.isSentOtp = false;
    });
    builder.addCase(sentOTP.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userOTP.isSentOtp = true;
      state.userOTP.isVerifiedOtp = false;
    });
    builder.addCase(sentOTP.rejected, (state, action) => {
      console.log(action.payload);
      state.isLoading = false;
      state.error = action.payload.error;
    });

    // otp verification

    builder.addCase(verifyOtp.pending, (state) => {
      state.isLoading = true;
      state.userOTP.isVerifiedOtp = false;
    });
    builder.addCase(verifyOtp.fulfilled, (state) => {
      state.isLoading = false;
      state.userOTP.isSentOtp = false;
      state.userOTP.isVerifiedOtp = true;
      state.error = null;
    });
    builder.addCase(verifyOtp.rejected, (state, action) => {
      console.log(action.payload);
      state.isLoading = false;
      state.error = action.payload.error;
    });

    // change password

    builder.addCase(changePassword.pending, (state) => {
      state.isLoading = true;
      state.isPasswordChanged = false;
    });
    builder.addCase(changePassword.fulfilled, (state) => {
      state.isLoading = false;
      state.isPasswordChanged = true;
      state.error = null;
    });
    builder.addCase(changePassword.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload.error;
    });

    // change email

    builder.addCase(changeEmail.pending, (state) => {
      state.isLoading = true;
      state.isEmailChanged = false;
    });
    builder.addCase(changeEmail.fulfilled, (state) => {
      state.isLoading = false;
      state.isEmailChanged = true;
      state.error = null;
    });
    builder.addCase(changeEmail.rejected, (state, action) => {
      state.isLoading = false;
      state.isEmailChanged = false;
      state.error = action.payload.error;
    });
  },
});

export const {
  // first two is inside of editing profile button like change password and change email panel
  showActivePanel,
  hideActivePanel,
  showEditOptionPanel,
  hideEditOptionPanel,
  resetPreviosSession,
} = userInfoSlice.actions;

export default userInfoSlice.reducer;
