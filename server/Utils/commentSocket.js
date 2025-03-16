import commentSchema from "../Models/commendSchema.js";
import travelLogSchema from "../Models/travelLogSchema.js";

export const initCommentSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Comment Socket", socket.id);

    socket.on("comment", async (data) => {
      const { logId, comment, userId } = data;
      console.log("comment", data);

      const log = await travelLogSchema.findById(logId);

      if (!log) {
        return socket.emit("error", "log not found");
      }
      //// add user it to comments array who commented

      const newComment = await commentSchema.create({
        user: userId,
        travelLog: logId,
        text: comment,
      });
      await log.save();

      log.comments.push(userId);
      await log.save();

      console.log("comment added");
    });

    socket.on("disconnect", (socket) => {
      console.log("user disconnected", socket.id);
    });
  });
};
