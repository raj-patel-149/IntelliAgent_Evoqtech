const express = require("express");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const bcrypt = require("bcrypt");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

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

// **Signup Route**
router.post("/signup", upload.single("profile"), async (req, res) => {
  const { name, email, password, mobile_Number, location } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10); // Generate a salt
    const hashedPassword = await bcrypt.hash(password, salt);

    let profilePictureUrl = "";
    if (req.file) {
      profilePictureUrl = await uploadPhotoOnCloudinary(req.file.buffer);
    }

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      mobile_Number,
      location,
      profilePicture: profilePictureUrl,
    });
    
     await newUser.save();

    

    res.json({ success: true, message: "Signup successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// **Login Route**
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("from login --------------->", req.body);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User does not exist. SignUp Please",
      });
    }
    if (
      user.role === "client" &&
      user.user_Status !== "verified" &&
      user.password === ""
    ) {
      return res.status(401).json({
        success: false,
        message: "See your mail box and complete the reset password process",
      });
    }
    // Password verification
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    if (user.status !== "active") {
      return res.status(401).json({
        success: false,
        message: "This user is inactive. Please contact the admin.",
      });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    res.json({
      success: true,
      message: "Login successful",
      role: user.role,
      id: user._id,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// **Logout Route**
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
});

module.exports = router;
