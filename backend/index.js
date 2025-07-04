require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db"); // Import database connection
const cors = require("cors");
const cookieParser = require("cookie-parser");

const cronJobs = require("./utils/cronJobs");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const caseRoutes = require("./routes/caseRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const skillRoutes = require("./routes/skillRoutes");
const notificationRoutes = require("./routes/notification");
const employeeRoutes = require("./routes/employeeRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const teamServiceRoutes = require("./routes/teamServiceRoute");

const priceRoute = require("./routes/priceRoutes");
const calPriceRoute = require("./routes/price");

const teamServiceTemplateRoutes = require("./routes/teamServiceTemplateRoutes");
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "https://intelli-agent-evoqtech.vercel.app",
    credentials: true,
  })
);
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/case", caseRoutes);
app.use("/api/image", uploadRoutes);
app.use("/api/skill", skillRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/teamService", teamServiceRoutes);
app.use("/api/calculate-price", calPriceRoute);

app.use("/api/price", priceRoute);

app.use("/api/TeamServiceTemplate", teamServiceTemplateRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
