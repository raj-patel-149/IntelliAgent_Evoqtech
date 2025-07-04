const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    mobile_Number: String,
    location: String,
    profilePicture: String,
    role: "client",
  },
  { timestamps: true }
);

const Customer =
  mongoose.models.CustomerData ||
  mongoose.model("CustomerData", customerSchema);

module.exports = Customer;
