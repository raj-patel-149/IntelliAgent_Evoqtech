const mongoose = require("mongoose");

const managerSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    mobile_Number: String,
    location: String,
    profilePicture: String,
    role: "manager",
  },
  { timestamps: true }
);

const Manager =
  mongoose.models.ManagerData || mongoose.model("ManagerData", managerSchema);

module.exports = Manager;
