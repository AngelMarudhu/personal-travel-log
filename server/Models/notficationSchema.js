import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  //  type of notification in future we can add some extra types as well
  type: {
    type: String,
    enum: ["REPORT"],
    required: true,
  },
  // this one for message like user marudhu reported spam
  message: {
    type: String,
    required: true,
  },
  // admin who received it
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("Notification", NotificationSchema);
