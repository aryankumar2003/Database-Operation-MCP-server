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

server.tool(
  "update-student",
  "Update an existing student in the database",
  {
    StudentID: z.string().describe("Unique ID of the student to update"),
    updates: z
      .object({
        name: z.string().optional().describe("Updated name"),
        age: z.number().optional().describe("Updated age"),
        grade: z.string().optional().describe("Updated grade"),
        subjects: z.array(z.string()).optional().describe("Updated subjects"),
        skills: z.array(z.string()).optional().describe("Updated skills"),
        attendance: z.number().optional().describe("Updated attendance percentage"),
        graduationDate: z.string().optional().describe("Updated graduation date in ISO format"),
      })
      .describe("Fields to update"),
  },
  async ({ StudentID, updates }) => {
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }


      const student = await Student.findOne({ StudentID });
      if (!student) {
        return {
          content: [
            {
              type: "text",
              text: `Student with ID ${StudentID} not found.`,
            },
          ],
        };
      }

      if (updates.graduationDate) {
        (student as any).graduationDate = new Date(updates.graduationDate);
      }

      Object.assign(student, { ...updates, graduationDate: undefined });
      await student.save();

      return {
        content: [
          {
            type: "text",
            text: `Updated student ${StudentID} successfully.`,
          },
        ],
      };
    } 
  
);

server.tool(
  "delete-student",
  "Delete a student from the database",
  {
    StudentID: z.string().describe("Unique ID of the student to delete"),
  },
  async ({ StudentID }) => {
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }

    
      const result = await Student.findOneAndDelete({ StudentID });

      if (!result) {
        return {
          content: [
            {
              type: "text",
              text: `No student found with ID ${StudentID}.`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `Student with ID ${StudentID} has been deleted.`,
          },
        ],
      };
    } 
);



async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Database MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});