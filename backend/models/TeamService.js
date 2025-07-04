const mongoose = require("mongoose");

const teamServiceSchema = new mongoose.Schema(
  {
    employees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    ],
    employees_name: [
      {
        type: String,
      },
    ],
    leader_employee_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    leader_employee_name: {
      type: String,
    },
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

const TeamService =
  mongoose.models.TeamService ||
  mongoose.model("TeamService", teamServiceSchema);

module.exports = TeamService;
