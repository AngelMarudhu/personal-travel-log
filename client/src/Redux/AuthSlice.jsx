import { createSlice } from "@reduxjs/toolkit";
import { registerUser, loginUser, getUserInfo } from "../Features/AuthFeatures";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isLoggedIn: false,
  token: localStorage.getItem("token") || null,
  isLoading: false,
  error: null,
  isRegistered: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: (state) => {
      state.user = null;
      state.isLoading = false;
      state.error = null;
      state.isLoggedIn = false;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.isRegistered = false;
    });

    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isRegistered = true;
      state.isLoading = false;
    });

    builder.addCase(registerUser.rejected, (state, action) => {
      //   console.log(action.payload.error);
      state.isLoading = false;
      state.error = action.payload.error;
    });

    //// login user
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoggedIn = true;
      state.isLoading = false;
      state.isRegistered = false;
      state.user = action.payload.user;
      state.token = action.payload.token;

      localStorage.setItem("user", JSON.stringify(state.user));
      localStorage.setItem("token", state.token);
    });

    builder.addCase(loginUser.rejected, (state, action) => {
      // console.log(action.payload.error);
      state.isLoading = false;
      state.error = action.payload.error;
    });

    // get user info

    builder.addCase(getUserInfo.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getUserInfo.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.error = null;

      localStorage.removeItem("user");
      localStorage.setItem("user", JSON.stringify(state.user));
    });
    builder.addCase(getUserInfo.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload.error;
    });
  },
});

export const { logOut } = authSlice.actions;

export default authSlice.reducer;
