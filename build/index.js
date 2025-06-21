"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
const DB_1 = require("./DB");
const student_model_1 = require("./student.model");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Create server instance
const server = new mcp_js_1.McpServer({
    name: "Database MCP Server",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
    },
});
server.tool("student-database-info", "Get database information", {}, async () => {
    if (mongoose_1.default.connection.readyState === 0) {
        await (0, DB_1.connectDB)();
    }
    const dbInfo = await student_model_1.Student.find();
    return {
        content: [
            {
                type: "text",
                text: `Database Information:\n\n${JSON.stringify(dbInfo, null, 2)}`,
            },
        ],
    };
});
server.tool("insert-student", "Insert a new student into the database", {
    name: zod_1.z.string().describe("Student's name"),
    age: zod_1.z.number().describe("Student's age"),
    grade: zod_1.z.string().describe("Student's grade"),
    subjects: zod_1.z.array(zod_1.z.string()).describe("Subjects the student is enrolled in"),
    skills: zod_1.z.array(zod_1.z.string()).describe("Skills the student has"),
    attendance: zod_1.z.number().describe("Attendance percentage"),
    graduationDate: zod_1.z.string().describe("Graduation date in ISO format"),
    StudentID: zod_1.z.string().describe("Unique student ID"),
}, async ({ name, age, grade, subjects, skills, attendance, graduationDate, StudentID, }) => {
    if (mongoose_1.default.connection.readyState === 0) {
        await (0, DB_1.connectDB)();
    }
    const newStudent = new student_model_1.Student({
        _id: new mongoose_1.default.Types.ObjectId(),
        name,
        age,
        grade,
        subjects,
        skills,
        attendance,
        graduationDate: new Date(graduationDate),
        StudentID,
    });
    await newStudent.save();
    return {
        content: [
            {
                type: "text",
                text: `Inserted student: ${name} with ID: ${newStudent._id}`,
            },
        ],
    };
});
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error("Database MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
