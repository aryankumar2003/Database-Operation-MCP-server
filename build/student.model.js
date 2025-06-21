"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const studentSchema = new mongoose_1.default.Schema({
    _id: mongoose_1.default.Schema.Types.ObjectId,
    name: String,
    age: Number,
    grade: String,
    subjects: [String],
    skills: [String],
    attendance: Number,
    graduationDate: Date,
    StudentID: String
});
exports.Student = mongoose_1.default.model("Student", studentSchema);
