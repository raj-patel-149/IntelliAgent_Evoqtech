const express = require("express");
const router = express.Router();
const TeamServiceTemplate = require("../models/TeamServiceTemplate");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
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
        { folder: "service_pictures" }, // Different folder for services
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

// @route   GET /api/team-templates
// @desc    Fetch all team service templates
// @access  Public or Protected (you can add middleware for auth if needed)
router.get("/allTeamServicesTemplates", async (req, res) => {
  try {
    const templates = await TeamServiceTemplate.find();
    res.status(200).json({ success: true, data: templates });
  } catch (error) {
    console.error("Error fetching templates:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/teamServiceTemplate-data-Byid/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const template = await TeamServiceTemplate.findById(id);

    if (!template) {
      return res
        .status(404)
        .json({ success: false, message: "Template not found" });
    }

    res.status(200).json({ success: true, data: template });
  } catch (error) {
    console.error("Error fetching template by ID:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// add data in database

router.post(
  "/store-teamService-template",
  upload.single("servicePicture"), // This handles the file upload
  async (req, res) => {
    try {
      // Parse the requirements from the FormData
      const requirements = JSON.parse(req.body.requirements);

      // Parse the arrays from comma-separated strings
      const tools_needed = req.body.tools_needed
        ? req.body.tools_needed.split(",")
        : [];
      const skills_tags = req.body.skills_tags
        ? req.body.skills_tags.split(",")
        : [];

      let servicePictureUrl = "";
      if (req.file) {
        servicePictureUrl = await uploadPhotoOnCloudinary(req.file.buffer);
      }

      const newTemplate = new TeamServiceTemplate({
        service_name: req.body.service_name,
        completion_time: req.body.completion_time,
        description: req.body.description,
        requirements: requirements,
        leader_required: req.body.leader_required === "true",
        tools_needed: tools_needed,
        skills_tags: skills_tags,
        basePrice: req.body.basePrice,
        servicePicture: servicePictureUrl,
      });

      const savedTemplate = await newTemplate.save();
      res.status(201).json(savedTemplate);
    } catch (error) {
      console.error("Error creating service template:", error);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

// DELETE route to delete a TeamServiceTemplate by ID
router.delete("/delete-team-service-template/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTemplate = await TeamServiceTemplate.findByIdAndDelete(id);

    if (!deletedTemplate) {
      return res.status(404).json({ message: "Template not found." });
    }

    res.status(200).json({ message: "Template deleted successfully." });
  } catch (error) {
    console.error("Delete Template Error:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

module.exports = router;
