import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectDB() {
  try {
  
    await mongoose.connect("mongodb+srv://aryankingroyal:eGCOwO6aOyTifeOH@cluster0.qecg7fi.mongodb.net/");
    
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}
