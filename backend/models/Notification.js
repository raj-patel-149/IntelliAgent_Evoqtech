const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    case_id: {
      type: mongoose.Schema.Types.ObjectId,

      required: false,
    },
    receiver: [String],
    sender: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
    },
    case_status: {
      type: String,
    },
   read: {
      type: Boolean,
      default: false,
    },
    department: {
      type: String,
    },
    service: {
      type: String,
    },
    time: {
      type: String, // Stores time as "HH:MM"
      required: true,
    },
    date: {
      type: String, // Stores date as "DD/MM/YYYY"
      required: true,
    },
  },
  { timestamps: true }
);

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

module.exports = Notification;
