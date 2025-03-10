import express from "express";
import {
  authenticateUser,
  authorizeRoles,
} from "../Middleware/Authenticate.js";
import {
  blockUser,
  deleteUser,
  getAllUsers,
  unBlockeUser,
} from "../Controllers/Admin/AdminController.js";

export const adminRouter = express.Router();

adminRouter.get(
  "/get-all-users",
  authenticateUser,
  authorizeRoles("admin"),
  getAllUsers
);

adminRouter.delete(
  "/delete-user/:id",
  authenticateUser,
  authorizeRoles("admin"),
  deleteUser
);

adminRouter.put(
  "/block-user/:id",
  authenticateUser,
  authorizeRoles("admin"),
  blockUser
);

adminRouter.put(
  "/unblock-user/:id",
  authenticateUser,
  authorizeRoles("admin"),
  unBlockeUser
);
