const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    mobile_Number: String,
    location: String,
    role: "agent",

    department: {
      type: String,
      enum: [
        "saloon",
        "garage",
        "repairing",
        "servicing",
        "plumbing",
        "electrical",
        "carpentry",
        "cleaning",
        "painting",
      ], 
      required: function () {
        return this.role === "agent"; // ✅ Required only if role is "agent"
      },
    },
    service: [String],
    profilePicture: String,

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    user_Status: {
      type: String,
      enum: ["Email sent", "Email accepted", "Password not set", "verified"],
      required: function () {
        return this.role === "user"; // Only required when role is 'user'
      },
    },
    score: {
      type: Number,
      required: function () {
        return this.role === "agent"; // Required only if role is 'agent'
      },
      default: function () {
        return this.role === "agent" ? 100 : ""; // Default score 100 for agents, empty for others
      },
    },
  },
  { timestamps: true }
);

const Employee =
  mongoose.models.EmployeeData ||
  mongoose.model("EmployeeData", employeeSchema);
module.exports = Employee;
