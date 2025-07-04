const mongoose = require("mongoose");

const employeeSchedulingSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true,
    },
    date: {
      type: String,
    },
    start_time: {
      type: Number,
      required: true,
    },
    end_time: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

const EmployeeScheduling =
  mongoose.models.EmployeeScheduling ||
  mongoose.model("EmployeeScheduling", employeeSchedulingSchema);

module.exports = EmployeeScheduling;
