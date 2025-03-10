import jwt from "jsonwebtoken";
import userSchema from "../Models/UserSchema.js";

export const authenticateUser = async (req, res, next) => {
  try {
    // console.log(req.headers);
    // console.log(req.files, req.body, "authenticate");
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decodedToken);
    const user = await userSchema.findById(decodedToken.userId);
    // console.log(user);
    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "access denied" });
    }
    next();
  };
};
