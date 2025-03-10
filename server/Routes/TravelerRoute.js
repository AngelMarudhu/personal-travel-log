import express from "express";

import {
  changeEmail,
  changePassword,
  createTravelLog,
  deleteTravelLog,
  getCommentTravelLog,
  getTravelLog,
  getTravelLogById,
  getTrendingPlaces,
  updateTravelLog,
  userSentOtp,
  verifyOtp,
} from "../Controllers/TravelLog/TravelController.js";
import {
  findNearbyLocation,
  searchByLocation,
} from "../Controllers/TravelLog/SearchTraveler.js";

export const travelerRouter = express.Router();

travelerRouter.post("/log", createTravelLog);

travelerRouter.get("/get-travel-logs/:id", getTravelLog);

travelerRouter.put("/update-travel-log/:id", updateTravelLog);

travelerRouter.delete("/delete-travel-log/:id", deleteTravelLog);

travelerRouter.get("/get-user-travel-logs", getTravelLogById);

travelerRouter.get("/search-log-by-location", searchByLocation);

travelerRouter.get("/get-nearby-location", findNearbyLocation);

travelerRouter.get("/get-trending-logs", getTrendingPlaces);

travelerRouter.get("/get-comment-travel-log/:id", getCommentTravelLog);

travelerRouter.post("/user-sent-otp", userSentOtp);

travelerRouter.post("/user-verify-otp", verifyOtp);

travelerRouter.put("/change-user-password", changePassword);

travelerRouter.put("/change-user-email", changeEmail);
