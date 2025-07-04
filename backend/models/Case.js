const mongoose = require("mongoose");
const DepartmentProgressSchema = new mongoose.Schema({
  name: { type: String },
  employees: [
    {
      _id: mongoose.Schema.Types.ObjectId,
    },
  ],
  startedAt: Date,
  completedAt: Date,
  status: {
    type: String,
    enum: ["accepted", "inProgress", "completed", "halted"],
    default: "accepted",
  },
});

const caseSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
    },
    receiver: {
      type: String,
      default: "NA",
      required: true,
    },
    header: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      required: true,
    },
    teamServiceTemplateId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    teamServiceDetailsId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    departmentProgress: [DepartmentProgressSchema],
    time: {
      type: String,
      required: true,
    },
    reminder_time: {
      type: String,
    },
    miss_time: {
      type: String,
    },
    scheduled_start_time: {
      type: Date, // Changed from String to Date for better handling
    },

    halted_time: { type: Date },
    actual_start_time: { type: Date },
    actual_end_time: { type: Date },

    date: {
      type: String, // If this is for display purposes, it's fine. Otherwise, consider using `Date`.
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    teamWork: {
      type: String,
    },
    case_status: {
      type: String,
      enum: ["accepted", "rejected", "pending"],
      default: "pending",
    },
    service_status: {
      type: String,
      enum: [
        // Case lifecycle
        "pending", // Case raised by customer, awaiting agent acceptance
        "expired", // No agent accepted the case within the required time
        "accepted", // Agent has accepted the case but has not started service yet
        "assigned", // Case was manually assigned by a manager/admin to an agent

        // Service process
        "waitingToStart",
        "scheduled",           // A specific date/time is scheduled for service
        "inProgress",          // Agent is actively working on the service
        "waitingForCustomer",  // Service is delayed due to customer unavailability
        "waitingForParts",     // Service is delayed because spare parts are needed
        "completed",           // Service is successfully finished

        // Missed or delayed service
        "missed", // Agent did not repair AC on time
        "waitingForApproval", // Agent wants to attend missed service, awaiting manager's approval
        "reopened", // Manager approved the missed service, and it is active again

        // Other cases
        "halted", // Service was started but stopped due to an issue
        "rejected", // Case was denied by an agent (if applicable)
        "cancelled", // Case was canceled by the customer
        "closed", // Case is finalized and cannot be reopened
      ],
      default: "pending",
    },

    reminder_sent: { type: Boolean, default: false }, // New field
  },
  { timestamps: true }
);

const Case = mongoose.model("Case", caseSchema);

module.exports = Case;
