const mongoose = require("mongoose");

const notification2Schema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,

      required: true,
    },
    
    message: {
      type: String,
      required: true,
    },
   
   read: {
      type: Boolean,
      default: false,
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

const Notification2 =
  mongoose.models.Notification2 ||
  mongoose.model("Notification2", notification2Schema);

module.exports = Notification2;
