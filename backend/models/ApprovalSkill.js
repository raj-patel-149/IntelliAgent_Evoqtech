const mongoose = require("mongoose");

const approvalSkillSchema = new mongoose.Schema(
  {
    skill_Name: {
      type: String,
      required: true,
      trim: true,
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const ApprovalSkill =
  mongoose.models.ApprovalSkill ||
  mongoose.model("ApprovalSkill", approvalSkillSchema);

module.exports = ApprovalSkill;
