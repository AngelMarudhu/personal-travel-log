import mongoose from "mongoose";

const ExpensesSchema = new mongoose.Schema(
  {
    travelLog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TravelLog",
      required: true,
    },
    transPort: {
      mode: {
        type: String,
        enum: ["bus", "train", "flight", "car"],
        default: "car",
      },
      fuelOrTicketCost: {
        type: Number,
        default: 0,
      },
    },
    accomodation: {
      type: Number,
      default: 0,
    },
    food: {
      type: Number,
      default: 0,
    },
    activities: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Expenses", ExpensesSchema);
