import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../Redux/AuthSlice.jsx";
import travelLogSlice from "../Redux/TravelLogSlice.jsx";
import userLogSlice from "../Redux/UserLogSlice.jsx";
import adminSlice from "../Redux/Admin/AdminSlice.jsx";
import searchLogSlice from "../Redux/SearchLogSlice.jsx";
import { getCommentTravelLog } from "../Features/TravelLogFeature.jsx";
import userInfoSlice from "../Redux/Traveler/userInfoSlice.jsx";
import { setupListeners } from "@reduxjs/toolkit/query";

// import { combineReducers } from "@reduxjs/toolkit";

// const travelerReducer = {
//   travelLog: travelLogSlice,
//   userLog: userLogSlice,
// };

// const adminReducer = {
//   admin: adminSlice,
// };

// const rootReducer = combineReducers({
//   auth: authSlice,
//   ...localStorage.getItem
// })

export const store = configureStore({
  reducer: {
    auth: authSlice,
    travelLog: travelLogSlice,
    userLog: userLogSlice,
    admin: adminSlice,
    searchLogByLocation: searchLogSlice,
    userInfo: userInfoSlice,
    [getCommentTravelLog.reducerPath]: getCommentTravelLog.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(getCommentTravelLog.middleware),
});
