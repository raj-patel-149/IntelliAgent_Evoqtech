const mongoose = require("mongoose");

const requirementSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
});

const teamServiceTemplateSchema = new mongoose.Schema(
  {
    service_name: {
      type: String,
      required: true,
      unique: true, // Assuming each service is unique
    },
    completion_time: {
      type: String,
      required: true, // e.g., "4 hours"
    },
    description: {
      type: String,
    },
    requirements: {
      type: [requirementSchema],
      required: true, // Array of { department, count }
    },
    leader_required: {
      type: Boolean,
      default: true,
    },
    tools_needed: {
      type: [String],
      default: [],
    },
    skills_tags: {
      type: [String],
      default: [],
    },
    basePrice: {
      type: Number,
      required: [true, "Base price is required"],
      min: [0, "Price cannot be negative"],
    },
    currency: {
      type: String,
      default: "INR",
      enum: ["INR", "USD", "EUR"],
      default: "INR",
    },
    servicePicture: String,
  },
  { timestamps: true }
);

const TeamServiceTemplate =
  mongoose.models.TeamServiceTemplate ||
  mongoose.model("TeamServiceTemplate", teamServiceTemplateSchema);

module.exports = TeamServiceTemplate;
