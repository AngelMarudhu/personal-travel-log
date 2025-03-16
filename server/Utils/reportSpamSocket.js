import travelLogSchema from "../Models/travelLogSchema.js";
import reportSchema from "../Models/reportSchema.js";
import userSchema from "../Models/UserSchema.js";
import notficationSchema from "../Models/notficationSchema.js";

export const initReportSpamSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Report Spam Socket", socket.id);

    socket.on("reportSpam", async (data) => {
      //   console.log(data);
      try {
        const { reason, reportedUser, reporter, createdAt, reportedType } =
          data;
        //   console.log(reason, reportedUser, reporter, createdAt, reportedType);
        const reportedUserInfo = await userSchema.findById(reportedUser);

        if (!reportedUserInfo) {
          console.log("reported user not found");
          return;
        }

        await reportSchema.create({
          reason,
          reportedUser: reportedUser,
          reporter,
          createdAt,
          reportedType,
        });

        console.log("report saved successfully");

        // store the notification in the database then emit the notification to admin
        const admin = await userSchema.findOne({ role: "admin" });

        if (!admin) {
          console.log("admin not found");
          return;
        }

        const newNotification = await notficationSchema.create({
          type: "REPORT",
          message: `${reportedUserInfo.name} reported ${reason}`,
          adminId: admin._id,
          isRead: false,
          createdAt: new Date(),
        });

        console.log("notification saved successfully");

        io.emit("newNotification", newNotification);

        socket.emit("reportSaved", {
          success: true,
        });
      } catch (error) {
        console.log(error);
      }
    });
  });
};
