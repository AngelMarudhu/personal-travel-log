import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected to travel-log");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
