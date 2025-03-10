import likeSchema from "../Models/likeSchema.js";
import travelLogSchema from "../Models/travelLogSchema.js";

export const initLikeSchema = (io) => {
  io.on("connection", (socket) => {
    console.log("user connected", socket.id);

    socket.on("likes", async (data) => {
      const { logId, userId } = data;
      // console.log(data);

      const log = await travelLogSchema.findById(logId);

      if (!log) {
        return socket.emit("error", "log not found0");
      }
      /// check if user has already liked the log

      const isLiked = await likeSchema.findOne({
        user: userId,
        travelLog: logId,
      });
      if (isLiked) {
        //// we need
        return socket.emit("error", "you have already liked this log");
      }
      // add user id to likes array

      const newLike = await likeSchema.create({
        user: userId,
        travelLog: logId,
      });

      await log.save();

      log.likes.push(userId);

      await log.save();

      // const updateLog = await travelLogSchema.findById(logId).populate("likes");
      // // console.logg(updateLog);
      // io.emit("updateLikes", { logId, likes: updateLog.likes.length });

      console.log("likes updated");
    });

    socket.on("disconnect", (socket) => {
      console.log("user disconnected", socket.id);
    });
  });
};
