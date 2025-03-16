import travelLogSchema from "../../Models/travelLogSchema.js";
import userSchema from "../../Models/UserSchema.js";
import notificationSchema from "../../Models/notficationSchema.js";

export const getAllUsers = async (req, res) => {
  try {
    const travelers = await userSchema
      .find({ role: "traveler" })
      .select("-password");

    // we need admin details like total users and total logs and total likes and total comments

    const totalUsers = travelers.length;
    const totalLogs = await travelLogSchema.countDocuments();

    const totalLikes = await travelLogSchema.aggregate([
      {
        $project: {
          likesCount: { $size: "$likes" },
        },
      },
      {
        $group: {
          _id: null,
          totalLikes: { $sum: "$likesCount" },
        },
      },
    ]);

    const totalComments = await travelLogSchema.aggregate([
      {
        $project: {
          commentsCount: { $size: "$comments" },
        },
      },
      {
        $group: {
          _id: null,
          totalComments: { $sum: "$commentsCount" },
        },
      },
    ]);

    // console.log(totalLikes);

    res.status(200).json({
      travelers,
      adminDetails: {
        totalUsers,
        totalLogs,
        totalLikes: totalLikes[0]?.totalLikes || 0,
        totalComments: totalComments[0]?.totalComments || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const existingUser = await userSchema.findById(id);

    if (!existingUser) {
      return res.status(404).json({ message: "user not found" });
    }

    const deltedUser = await userSchema.findByIdAndDelete(id);

    res.status(200).json({
      message: "user deleted successfully",
      userName: deltedUser.name,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const blockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const existingUser = await userSchema.findById(id);

    // console.log(id);

    if (!existingUser) {
      return res.status(404).json({ message: "user not found" });
    }

    await existingUser.updateOne(
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "user blocked successfully",
      success: true,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const unBlockeUser = async (req, res) => {
  try {
    const { id } = req.params;

    const existingUser = await userSchema.findById(id);

    if (!existingUser) {
      return res.status(404).json({ message: "user not found" });
    }

    await existingUser.updateOne(
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "user unblocked successfully",
      success: true,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getNotificationAdmin = async (req, res) => {
  try {
    const adminId = req.user._id;
    // console.log(adminId, "adminId");

    const notifications = await notificationSchema.find({
      isRead: false,
    });

    if (notifications.length === 0) {
      return res.status(200).json({
        message: "no notifications found",
      });
    }

    // console.log(notifications);

    res.status(200).json({
      message: "notifications fetched successfully",
      notifications,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    //// single hit mark as read notification all notification mark as read
    const adminId = req.user._id;

    await notificationSchema.updateMany(
      { adminId: adminId, isRead: false },
      { $set: { isRead: true } }
    );
    res.status(200).json({
      message: "notifications marked as read",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
