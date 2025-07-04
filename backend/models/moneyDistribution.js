// backend/models/Booking.js
const mongoose = require("mongoose");

const moneyDistributionSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId },
    amount: { type: Number, required: true },
    managerAmount: { type: Number, required: true },
    employeeAmount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "accepted"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("moneyDistribution", moneyDistributionSchema);
