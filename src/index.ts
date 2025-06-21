import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { z } from "zod";
import { connectDB } from "./DB";
import { Student } from "./student.model";
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

// Create server instance
const server = new McpServer({
  name: "Database MCP Server",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});




server.tool(
  "student-database-info",
  "Get database information",
  {},
  async () => {
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }
    const dbInfo = await Student.find();
    return {
      content: [
        {
          type: "text",
          text: `Database Information:\n\n${JSON.stringify(dbInfo, null, 2)}`,
        },
      ],
    };
  }
);
server.tool(
  "insert-student",
  "Insert a new student into the database",
  {
    name: z.string().describe("Student's name"),
    age: z.number().describe("Student's age"),
    grade: z.string().describe("Student's grade"),
    subjects: z.array(z.string()).describe("Subjects the student is enrolled in"),
    skills: z.array(z.string()).describe("Skills the student has"),
    attendance: z.number().describe("Attendance percentage"),
    graduationDate: z.string().describe("Graduation date in ISO format"),
    StudentID: z.string().describe("Unique student ID"),
  },
  async (
    {
      name,
      age,
      grade,
      subjects,
      skills,
      attendance,
      graduationDate,
      StudentID,
    }
  ) => {
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }
    const newStudent = new Student({
      _id: new mongoose.Types.ObjectId(),
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
  }
)
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Database MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});