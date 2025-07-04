const express = require("express");
const User = require("../models/User");
const Skill = require("../models/Skill");
const Department = require("../models/Department");
const EmployeeScheduling = require("../models/EmployeeScheduling");
const Case = require("../models/Case");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";
const bcrypt = require("bcrypt");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// Multer setup (Memory storage)
const upload = multer({ storage: multer.memoryStorage() });

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload profile picture
const uploadPhotoOnCloudinary = async (buffer) => {
  try {
    if (!buffer) return null;

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "profile_pictures" },
        (error, result) => {
          if (result) resolve(result.secure_url);
          else reject(error);
        }
      );
      streamifier.createReadStream(buffer).pipe(stream);
    });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return null;
  }
};

// Configure Nodemailer with Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rdpatel11124@gmail.com",
    pass: "ldzy rwur lxab zwcr",
  },
});

router.get("/departments", async (req, res) => {
  try {
    const departments = await Department.find({}, "name"); // fetch only name field
    const departmentNames = departments.map((dept) => dept.name); // extract names

    res.status(200).json({ success: true, departments: departmentNames });
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.get("/skills", async (req, res) => {
  try {
    const { department } = req.query;
    let skills;
    // console.log("department", department);

    if (!department) {
      return res.status(400).json({ error: "Department name is required" });
    }

    // Fetch services based on department
    if (department === "all") {
      skills = await Skill.find().select("-__v -createdAt -updatedAt");
    } else {
      // console.log("department2:---", department);

      skills = await Skill.find({ department }).select(
        "-__v -createdAt -updatedAt"
      );
      // console.log("skills:---", skills);
    }

    if (skills.length === 0) {
      return res
        .status(404)
        .json({ error: "No skills found for this department" });
    }

    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ error: "Error fetching skills data" });
  }
});

router.get("/get-employee-by-department", async (req, res) => {
  try {
    const { department } = req.query;

    if (!department) {
      return res.status(400).json({
        success: false,
        message: "Department is required in query parameters.",
      });
    }

    const agents = await User.find({ service: department });

    res.status(200).json({ success: true, agents });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// get employees by two or more departments

router.get("/get-employee-by-moredepartments", async (req, res) => {
  try {
    let { department } = req.query;

    if (typeof department === "string") {
      department = department.split(",").map((d) => d.trim());
    }

    // Ensure department is an array and not empty
    if (!Array.isArray(department) || department.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one department is required in query parameters.",
      });
    }

    // Find users whose 'department' is in the department list

    const agents = await User.find({ department: { $in: department } });

    res.status(200).json({ success: true, agents });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// **Add User Route (Admin Only)**
router.post("/add-user", upload.single("profile"), async (req, res) => {
  const { name, email, mobile_Number, location, department, service } =
    req.body;

  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const existingUser = await User.findOne({ $or: [{ name }, { email }] });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          existingUser.name === name
            ? "Username already exists"
            : "Email already exists",
      });
    }

    const resetToken = jwt.sign({ email: email }, SECRET_KEY, {
      expiresIn: "10m",
    });

    let profilePictureUrl = "";
    if (req.file) {
      profilePictureUrl = await uploadPhotoOnCloudinary(req.file.buffer);
    }

    const newUser = new User({
      name,
      email,
      mobile_Number,
      location,
      department,
      service,
      role: "agent",
      password: "",
      user_Status: "Email sent",
      profilePicture: profilePictureUrl,
    });
    await newUser.save();

    const resetUrl = `https://intelli-agent-evoqtech.vercel.app/reset-password?token=${resetToken}`;
    // Define Email Content
    const mailOptions = {
      from: "HCMS <rdpatel11124@gmail.com>",
      to: email,
      subject: `Welcome to HCMS - Your Account is Ready!`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <div style="background: #2563eb; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">HCMS - Human Capital Management System</h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 25px;">
            <h2 style="color: #2563eb; margin-top: 0;">Welcome to the Team, ${name}!</h2>
            
            <p style="font-size: 16px; line-height: 1.6;">
              Your manager has created an account for you on our HCMS platform. 
              You're now part of our organization's digital ecosystem!
            </p>
            
            <div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 12px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Your Account Details:</strong></p>
              <p style="margin: 5px 0;">👤 <strong>Name:</strong> ${name}</p>
              <p style="margin: 5px 0;">✉️ <strong>Email:</strong> ${email}</p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6;">
              To get started, please set your password by clicking the button below:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="display: inline-block; padding: 12px 30px; background: #2563eb; color: white; 
                        text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">
                Set Your Password
              </a>
            </div>
            
            <p style="font-size: 14px; color: #64748b;">
              <strong>Note:</strong> This link will expire in 24 hours. If you didn't request this, please ignore this email.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background: #f1f5f9; padding: 15px; text-align: center; font-size: 14px; color: #64748b;">
            <p style="margin: 5px 0;">© ${new Date().getFullYear()} HCMS Platform. All rights reserved.</p>
            <p style="margin: 5px 0;">Human Capital Management System</p>
          </div>
        </div>
      `,
    };

    // Send Email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Email sending failed:", err);
        return res.status(500).json({
          success: false,
          message: "Email sending failed",
          error: err,
        });
      }
      console.log("Email sent successfully:", info.response);
      return res.json({
        success: true,
        message: "User added successfully and email sent",
      });
    });

    res.json({ success: true, message: "User added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// **Handle Forgot Password**
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by ID and update status
    const user = await User.findOne({ email });

    const generateRandomPassword = () => {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let password = "";
      for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return password;
    };

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.user_Status === "Email sent") {
      return res.status(404).json({
        message:
          "Please accept email then you can use forgot password fuctionality",
      });
    }

    const newPassword = generateRandomPassword();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    user.user_Status = "verified";

    await user.save();

    // Define Email Content
    const mailOptions = {
      from: "rdpatel11124@gmail.com",
      to: email,
      subject: "Forgot Password Request",
      html: `<p>Hello <b>${user.name}</b>,</p>
           <p>Login using this password.</p>
           <p><b>User Name:</b> ${user.name}</p>
           <p><b>Email:</b> ${email}</p>
           <p><b>Your Password:</b> ${newPassword}</p>
           <p>
             <p>Click below to login:</p>
             <a href="http://localhost:3000/login" 
                style="padding: 10px 20px; background: #2e99e6; color: white; text-decoration: none;">Login Now</a>
        </p>
           <p>Best Regards,</p>
           <p>Team</p>
            `,
    };

    // Send Email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Email sending failed:", err);
        return res.status(500).json({
          success: false,
          message: "Email sending failed",
          error: err,
        });
      }
      console.log("Email sent successfully:", info.response);
      return res.json({
        success: true,
        message: "User added successfully and email sent",
      });
    });

    res.json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "User does not exist" });
  }
});

// **Handle Email Acceptance**
router.put("/accept-email/:token", async (req, res) => {
  try {
    const { token } = req.params;
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (error) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    const email = decoded.email;

    // Find user by ID and update status
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const acceptToken = jwt.sign({ email }, SECRET_KEY, {
      expiresIn: "2m",
    });
    if (user.user_Status !== "verified") {
      user.user_Status = "Email accepted";
    }
    await user.save();

    setTimeout(async () => {
      const expiredUser = await User.findOne({ email });
      if (
        expiredUser &&
        expiredUser.user_Status === "Email accepted" &&
        expiredUser.user_Status !== "verified"
      ) {
        expiredUser.user_Status = "Password not set";
        await expiredUser.save();
        console.log("Password not set");
      }
    }, 1 * 60 * 1000);

    res.json({ message: "Email accepted successfully", user: user });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/count", async (req, res) => {
  try {
    const count = await User.countDocuments(); // Correct way to count users
    res.json({ totalUsers: count });
  } catch (err) {
    console.error("Error fetching user count:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/count-clients", async (req, res) => {
  try {
    const countClient = await User.countDocuments({ role: "client" });
    res.json({ totalClient: countClient });
  } catch (error) {
    res.status(500).json({ error: "Error fetching client count" });
  }
});

// **Handle Password Reset**
router.post("/reset-password", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Update user password
    user.password = hashedPassword;
    user.user_Status = "verified";
    await user.save();

    return res.json({ message: "Password reset successful!" });
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
});

// **Fetch all users except admin**
router.get("/users", async (req, res) => {
  try {
    // Extract query params with default values
    const { status = "All", page = 0, limit = 10, search } = req.query;

    const filter = { role: "agent" }; // Fetch only users, not admins

    if (status && status !== "All") {
      filter.status = status;
    }

    if (search && search.length >= 3) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { password: { $regex: search, $options: "i" } },
      ];
    }

    // Ensure numeric values and prevent negative/zero values
    const pageNumber = Math.max(parseInt(page, 10) || 0, 0);
    const limitNumber = Math.max(parseInt(limit, 10) || 10, 1);
    const skip = pageNumber * limitNumber;

    // Get total users count
    const totalUsers = await User.countDocuments(filter);
    const users = await User.find(filter).skip(skip).limit(limitNumber);

    res.json({
      success: true,
      users,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalUsers / limitNumber),
        totalUsers,
        hasNextPage: pageNumber * limitNumber < totalUsers,
        hasPrevPage: pageNumber > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// **Fetch user by ID**
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
//fetch users by ids
router.post("/employees-by-ids", async (req, res) => {
  try {
    const { ids } = req.body; // Expecting an array of IDs

    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or empty ID array" });
    }

    const employees = await User.find({ _id: { $in: ids } }); // Fetch all matching employees

    if (employees.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No employees found" });
    }

    res.json({ success: true, employees });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// **Fetch user by Email**
router.get("/email/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });

    if (!user || user.role !== "user") {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }

    const status = user.user_Status;

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// Delete User
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// **Update User Route (Admin Only)**
router.put("/:id", upload.single("profilePicture"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mobile_Number, department, location, status } = req.body;
    // Check if user exists
    let user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let profilePictureUrl = "";
    if (req.file) {
      profilePictureUrl = await uploadPhotoOnCloudinary(req.file.buffer);
    }

    // Updated fields
    let updatedFields = {
      name,
      mobile_Number,
      department,
      location,
      status,
      profilePicture: profilePictureUrl,
    };

    const updatedUser = await User.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    res.json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
// *Update User Route (Admin Only)*
router.put("/edit-user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mobile_Number, department, location, status } = req.body;
    // Check if user exists
    let user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // If password is provided, hash it before updating
    let updatedFields = { name, mobile_Number, department, location, status };

    const updatedUser = await User.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    res.json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/user/:id/skills", async (req, res) => {
  try {
    const { id } = req.params;
    const { skills } = req.body; // Expect an array of skills

    const user = await User.findByIdAndUpdate(
      id,
      { service: skills },
      { new: true } // Return updated user
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user, message: "Skills updated successfully" });
  } catch (error) {
    console.error("Error updating skills:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/schedule/Employee", async (req, res) => {
  try {
    const { empId } = req.query;

    if (!empId) {
      return res
        .status(400)
        .json({ message: "empId query parameter is required." });
    }

    // Step 1: Fetch all scheduling data for this employee
    const schedules = await EmployeeScheduling.find({ employeeId: empId });

    if (!schedules.length) {
      return res
        .status(404)
        .json({ message: "No schedules found for this employee." });
    }

    // Step 2: For each schedule, fetch the Case manually by serviceId
    const caseDetails = await Promise.all(
      schedules.map((schedule) => Case.findById(schedule.serviceId))
    );

    // Step 3: Return both
    res.status(200).json({
      schedules,
      caseDetails,
    });
  } catch (error) {
    console.error("Error fetching employee schedule with case details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
