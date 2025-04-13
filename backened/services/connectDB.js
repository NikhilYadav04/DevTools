import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB, {});
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error("MongoDB Connection Error:", e.message);
    process.exit(1);
  }
};

export default connectDB;
