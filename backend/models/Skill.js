const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema(
  {
    skill_Name: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    basePrice: {
      type: Number,
      required: [true, "Base price is required"],
      min: [0, "Price cannot be negative"]
    },
    currency: {
      type: String,
      default: "INR",
      enum: ["INR", "USD", "EUR"]
    },
    description: {
      type: String,
      // required: [true, "Description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "NA"
    },
    duration: {
      value: { type: Number, default: 60 },
      unit: {
        type: String,
        enum: ["hour", "day", "session", "minutes"],
        default: "minutes"
      }
    }
  },
  { timestamps: true }
);

const Skill = mongoose.models.Skill || mongoose.model("Skill", caseSchema);
module.exports = Skill;
