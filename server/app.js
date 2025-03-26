import express from "express";
import cors from "cors";
import { loginRouter } from "./Routes/LoginRoute.js";
import { adminRouter } from "./Routes/AdminRoute.js";
import { travelerRouter } from "./Routes/TravelerRoute.js";
import { authenticateUser, authorizeRoles } from "./Middleware/Authenticate.js";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://personal-travel-log.onrender.com",
  })
);

app.use("/api/login", loginRouter);
app.use("/api/admin", adminRouter);

app.use(
  "/api/traveler",
  authenticateUser,
  authorizeRoles("traveler"),
  travelerRouter
);
