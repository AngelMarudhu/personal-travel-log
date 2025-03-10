import { createSlice } from "@reduxjs/toolkit";
import {
  blockUserFeature,
  deleteUserData,
  getAllUserDetails,
  unBlockUserFeature,
} from "../../Features/Admin/AdminFeature";

const initialState = {
  users: [],
  adminDetails: {},
  isLoading: false,
  error: null,
  deleted: {
    isDeleted: false,
    message: "",
    nameOfDeletedUser: "",
  },
  blocked: {
    isBlocked: false,
    message: "",
  },
  unblocked: {
    isUnblocked: false,
    message: "",
  },
  searchUsersName: {
    searchUserId: null,
  },
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setSearchUserName: (state, action) => {
      state.users.filter((user) => {
        if (user._id === action.payload) {
          state.searchUsersName.searchUserId = user._id;
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllUserDetails.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getAllUserDetails.fulfilled, (state, action) => {
      // console.log(action.payload);
      state.isLoading = false;
      state.users = action.payload.travelers;
      state.adminDetails = action.payload.adminDetails;
    });

    builder.addCase(deleteUserData.pending, (state) => {
      state.isLoading = true;
      state.deleted.isDeleted = false;
    });

    builder.addCase(deleteUserData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.deleted.isDeleted = true;
      state.deleted.message = action.payload.message;
      state.deleted.nameOfDeletedUser = action.payload.userName;
    });

    builder.addCase(deleteUserData.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload.error;
    });

    builder.addCase(blockUserFeature.pending, (state) => {
      state.isLoading = true;
      state.blocked.isBlocked = false;
    });

    builder.addCase(blockUserFeature.fulfilled, (state, action) => {
      state.isLoading = false;
      state.blocked.isBlocked = action.payload.success;
      state.blocked.message = action.payload.message;
    });

    builder.addCase(blockUserFeature.rejected, (state, action) => {
      state.isLoading = false;
      state.blocked.isBlocked = false;
      state.error = action.payload.error;
    });

    builder.addCase(unBlockUserFeature.pending, (state) => {
      state.isLoading = true;
      state.unblocked.isUnblocked = false;
    });

    builder.addCase(unBlockUserFeature.fulfilled, (state, action) => {
      state.isLoading = false;
      state.blocked.isBlocked = false;
      state.unblocked.isUnblocked = action.payload.success;
      state.unblocked.message = action.payload.message;
    });

    builder.addCase(unBlockUserFeature.rejected, (state, action) => {
      state.isLoading = false;
      state.unblocked.message = action.payload.error;
      state.unblocked.isUnblocked = false;
    });
  },
});

export const { setSearchUserName } = adminSlice.actions;

export default adminSlice.reducer;
