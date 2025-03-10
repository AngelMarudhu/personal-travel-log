import { createSlice } from "@reduxjs/toolkit";
import { getTravelLogs, getTrendingPlaces } from "../Features/TravelLogFeature";
import { createTraveLog } from "../Features/TravelLogFeature";
import _ from "lodash";

const initialState = {
  travelLogs: [],
  trendingPlaces: [],
  isLoading: false,
  isError: false,
  currentPage: 1,
  totalPages: 0,
  error: "",
};

const travelLogSlice = createSlice({
  name: "travelLog",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(getTravelLogs.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addCase(getTravelLogs.fulfilled, (state, action) => {
      // console.log(action.payload);
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.travelLogs = _.uniqBy(
        [...state.travelLogs, ...action.payload.travelLogs],
        "_id"
      );
      state.isLoading = false;
    });
    //// CREATE TRAVEL LOG EVENT REDUCERS

    builder.addCase(createTraveLog.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addCase(createTraveLog.fulfilled, (state, action) => {
      state.travelLogs.unshift(action.payload);
      state.isLoading = false;
      state.error = null;
    });

    builder.addCase(createTraveLog.rejected, (state, action) => {
      state.error = action.payload.error;
      state.isLoading = false;
    });

    builder.addCase(getTrendingPlaces.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addCase(getTrendingPlaces.fulfilled, (state, action) => {
      state.isLoading = false;
      state.trendingPlaces = action.payload;
    });
  },
});

export default travelLogSlice.reducer;
