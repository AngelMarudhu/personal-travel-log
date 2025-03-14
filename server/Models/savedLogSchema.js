import mongoose from "mongoose";
//// for saved logs schema

const SavedLogSchema = new mongoose.Schema(
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
    savedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

export default mongoose.model("SavedLog", SavedLogSchema);
