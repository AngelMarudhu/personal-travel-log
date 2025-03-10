import express from "express";
import {
  getUserInfo,
  loginUser,
  userRegister,
} from "../Controllers/Auth/LoginController.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../Middleware/Authenticate.js";

export const loginRouter = express.Router();

loginRouter.post("/register", userRegister);
loginRouter.post("/login", loginUser);
loginRouter.get(
  "/user-info",
  authenticateUser,
  authorizeRoles("traveler"),
  getUserInfo
);
