const express = require("express");
const router = express.Router();
const Skill = require("../models/Skill"); // Import your Skill model
const User = require("../models/User");
const ApprovalSkill = require("../models/ApprovalSkill");
const Department = require("../models/Department");
const TeamServiceTemplate = require("../models/TeamServiceTemplate");
const FIXED_GST = 0.18;
// Route to add a skill
router.post("/add-skill", async (req, res) => {
  try {
    const { skill_Name, department, Completion_time } = req.body;

    if (!skill_Name || !department || !Completion_time) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newSkill = new Skill({ skill_Name, department, Completion_time });
    await newSkill.save();

    res
      .status(201)
      .json({ message: "Skill added successfully", skill: newSkill });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding skill", error: error.message });
  }
});

// 1️⃣ Employee Adds a Skill (Stored in ApprovalSkill for Approval)
router.post("/add-skill-employee", async (req, res) => {
  try {
    const { skill_Name, employee } = req.body;

    if (!skill_Name || !employee) {
      return res
        .status(400)
        .json({ message: "Skill name and employee ID are required" });
    }

    // Store skill request in ApprovalSkill table
    const newApproval = new ApprovalSkill({
      skill_Name,
      employee,
      status: "pending", // Default status
    });

    await newApproval.save();

    res.status(201).json({
      message: "Skill request submitted for approval",
      approvalSkill: newApproval,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error submitting skill request",
      error: error.message,
    });
  }
});

// 2️⃣ Manager Approves or Rejects a Skill
router.put("/update-skill-status/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!["approved", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid status. Use 'approved' or 'rejected'" });
    }

    const skillRequest = await ApprovalSkill.findById(id);
    if (!skillRequest) {
      return res.status(404).json({ message: "Skill request not found" });
    }

    skillRequest.status = status;
    await skillRequest.save();

    // ✅ If approved, add the skill to the user's service array
    if (status === "approved") {
      const user = await User.findById(skillRequest.employee);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // ✅ Check if the skill is already present in services to prevent duplicates
      if (!user.service.includes(skillRequest.skill_Name)) {
        user.service.push(skillRequest.skill_Name);
        await user.save();
      }
    }

    res.status(200).json({
      message: `Skill request ${status} successfully`,
      updatedSkill: skillRequest,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating skill status", error: error.message });
  }
});

// 3️⃣ Fetch All Approval Skills (Filter by Status if Needed)
router.get("/approval-skills", async (req, res) => {
  try {
    const { status } = req.query; // Optional: Fetch by status

    let query = {};
    if (status) {
      query.status = status;
    }

    const approvals = await ApprovalSkill.find(query).populate(
      "employee",
      "name email"
    ); // Populate employee details if needed

    res
      .status(200)
      .json({ message: "Approval skills fetched successfully", approvals });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching approval skills",
      error: error.message,
    });
  }
});

// 3️⃣ Fetch All Approval Skills by Employee ID
router.get("/approval-skills/employee/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params; // Get employee ID from params

    // Find all approval skills for the given employee
    const approvals = await ApprovalSkill.find({
      employee: employeeId,
    });

    if (!approvals || approvals.length === 0) {
      return res
        .status(404)
        .json({ message: "No approval skills found for this employee." });
    }

    res.status(200).json({
      message: "Approval skills fetched successfully",
      approvals,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching approval skills",
      error: error.message,
    });
  }
});

router.get("/skills", async (req, res) => {
  try {
    const skills = await Skill.find();

    const updatedSkills = skills.map((skill) => {
      const gstAmount = skill.basePrice * FIXED_GST;
      const totalPrice = skill.basePrice + gstAmount;
      return {
        _id: skill._id,
        skill_Name: skill.skill_Name,
        department: skill.department,
        basePrice: skill.basePrice,
        currency: skill.currency,
        duration: skill.duration,
        totalPrice,
        gstAmount,
        description: "skill.description",
      };
    });

    res.json(updatedSkills);

    // res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/skills/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const skill = await Skill.findById(id);
    // console.log("skills", skill);
    const gstAmount = skill.basePrice * FIXED_GST;
    const totalPrice = skill.basePrice + gstAmount;
    const updatedSkills = {
      _id: skill._id,
      skill_Name: skill.skill_Name,
      department: skill.department,
      basePrice: skill.basePrice,
      currency: skill.currency,
      duration: skill.duration,
      totalPrice,
      gstAmount,
      description: skill.description,
    };

    res.json(updatedSkills);

    // res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Add Department
router.post("/add-department", async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ error: "Name and description are required" });
  }

  try {
    const department = new Department({ name, description });
    await department.save();
    return res.status(201).json(department);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add Skill
router.post("/add-New-skill", async (req, res) => {
  let { skill_Name, department, basePrice, description, duration } = req.body;

  console.log(skill_Name, department, basePrice, description, duration);

  if (!skill_Name || !department || !basePrice || !description || !duration) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const skill = new Skill({
      skill_Name,
      department,
      basePrice,
      description,
      duration,
    });

    await skill.save();
    return res.status(201).json(skill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
