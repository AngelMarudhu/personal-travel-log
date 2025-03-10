import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    travelLog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TravelLog",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Like", LikeSchema);
