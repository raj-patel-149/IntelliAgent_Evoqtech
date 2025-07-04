const mongoose = require("mongoose");
const { remindCases, missedCases } = require("../utils/cronJobs");
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI ||
         "mongodb+srv://kahodaraj123:raj16192003@cluster0.8v2fh.mongodb.net/crud"
    );
    console.log("MongoDB connected successfully");

    mongoose.connection.once("open", () => {
      console.log("🚀 Connected to MongoDB");
      setInterval(async () => {
        await remindCases();
        await missedCases();
      }, 60 * 1000); // Run every minute
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
