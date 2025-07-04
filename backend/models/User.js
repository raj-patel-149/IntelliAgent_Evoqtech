const mongoose = require("mongoose");
const Department = require("./Department");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    mobile_Number: String,
    location: String,
    role: {
      type: String,
      enum: ["manager", "agent", "client"],
      default: "client",
    },
    department: {
      type: String,
      required: function () {
        return this.role === "agent";
      },
      validate: {
        validator: async function (value) {
          if (!value) return true; // skip if not provided
          const dept = await Department.findOne({ name: value });
          return !!dept;
        },
        message:
          "Invalid department. Department does not exist in the database.",
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
      default: "Email sent",
      required: function () {
        return this.role === "client"; // Only required when role is 'user'
      },
    },
    score: {
      type: Number,
      required: function () {
        return this.role === "agent"; // Required only if role is 'agent'
      },
      default: function () {
        return this.role === "agent" ? 100 : 0; // Default score 100 for agents, empty for others
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.models.emps || mongoose.model("emps", userSchema);

module.exports = User;
