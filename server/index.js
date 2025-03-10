import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDB } from "./Config/Database.js";
import http from "http";
import { initSocket } from "./Utils/Socket.js";
// import CommendSchema from "./Models/commendSchema.js";
import mongoose from "mongoose";
import travelLogSchema from "./Models/travelLogSchema.js";
// import likeSchema from "./Models/likeSchema.js";

dotenv.config({
  path: "./.env",
});

// const createTravelLogManually = async (req, res) => {
//   const someUserId = new mongoose.Types.ObjectId("67aedc790db280d653dee140");

//   const newTravelLog = new travelLogSchema({
//     user: someUserId,
//     title: "My Travel Experience",
//     description: "A beautiful journey",
//     fromLocation: "Tirunelveli",
//     toLocation: "Pondicherry",
//     images: [
//       "https://images.unsplash.com/photo-1572196459043-5c39f99a7555?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG9yaXpvbnRhbHxlbnwwfHwwfHx8MA%3D%3D",
//     ],
//     cost: 2000,
//     date: new Date(),
//     placesToVisit: ["Beach", "Temple", "Lake"],
//     location: {
//       type: "Point",
//       coordinates: [13.026478, 80.298722],
//     },
//   });

//   newTravelLog
//     .save()
//     .then(() => console.log("Travel log saved successfully"))
//     .catch((err) => console.log("Error saving travel log:", err));
// };

// createTravelLogManually();

// const deleteComment = async () => {
//   try {
//     await CommendSchema.deleteMany({});
//   } catch (error) {}
// };

// deleteComment();

// const deleteTravelLog = async () => {
//   try {
//     await travelLogSchema.deleteMany({});
//   } catch (error) {}
// };

// deleteTravelLog();

// const deleteLike = async () => {
//   try {
//     await likeSchema.deleteMany({});
//   } catch (error) {}
// };
// deleteLike();

const server = http.createServer(app);

initSocket(server);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  connectDB();
});
