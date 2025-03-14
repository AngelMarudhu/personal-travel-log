import { createSlice } from "@reduxjs/toolkit";
import { postSavedLog, deleteSavedLog } from "../../Features/SavedLogFeature";

const initialState = {
  savedLog: [],
  isLoading: false,
  isSaved: false,
  error: null,
  isDeleted: false,
};

const savedLogSlice = createSlice({
  name: "savedLog",
  initialState,

  reducers: {},
  extraReducers: (builders) => {
    builders.addCase(postSavedLog.pending, (state) => {
      state.isLoading = true;
      state.isSaved = false;
      state.error = null;
    });

    builders.addCase(postSavedLog.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSaved = true;
      state.error = null;
    });

    builders.addCase(postSavedLog.rejected, (state, action) => {
      state.isLoading = false;
      state.isSaved = false;
      state.error = action.payload;
    });

    builders.addCase(deleteSavedLog.pending, (state) => {
      state.isLoading = true;
      state.isDeleted = false;
      state.error = null;
    });

    builders.addCase(deleteSavedLog.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isDeleted = true;
      state.error = null;
    });

    builders.addCase(deleteSavedLog.rejected, (state, action) => {
      state.isLoading = false;
      state.isDeleted = false;
      state.error = action.payload;
    });
  },
});

export default savedLogSlice.reducer;
