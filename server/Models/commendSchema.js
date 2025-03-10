import mongoose from "mongoose";

const CommendSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    travelLog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TravelLog",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", CommendSchema);
