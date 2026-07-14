import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

console.log("MONGO_URL =", process.env.MONGO_URL);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log("database connected ");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
  finally{
  
  }
};

export default connectDB;