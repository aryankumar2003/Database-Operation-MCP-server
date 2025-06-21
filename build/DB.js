"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function connectDB() {
    try {
        await mongoose_1.default.connect("mongodb+srv://aryankingroyal:eGCOwO6aOyTifeOH@cluster0.qecg7fi.mongodb.net/");
    }
    catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}
