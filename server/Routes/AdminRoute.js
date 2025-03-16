import express from "express";
import {
  authenticateUser,
  authorizeRoles,
} from "../Middleware/Authenticate.js";
import {
  blockUser,
  deleteUser,
  getAllUsers,
  getNotificationAdmin,
  markNotificationAsRead,
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

adminRouter.get(
  "/get-notification",
  authenticateUser,
  authorizeRoles("admin"),
  getNotificationAdmin
);

adminRouter.put(
  "/mark-notification-as-read",
  authenticateUser,
  authorizeRoles("admin"),
  markNotificationAsRead
);
