
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    age: Number,
    grade: String,
    subjects: [String],
    skills: [String],
    attendance: Number,
    graduationDate: Date,
    StudentID: String
});

export const Student = mongoose.model("Student", studentSchema);
