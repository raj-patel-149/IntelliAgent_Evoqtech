const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Fetch Employee Score by ID (GET request with employeeId as query param)
router.get("/score/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params; // Get employeeId from URL parameters

    const employee = await User.findById(employeeId);
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    res.json({ score: employee.score });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Update Employee Score (Deduct 5 points on rejection)
router.post("/reject/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params; // Get employeeId from URL parameter

    let employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Deduct 5 points, ensuring minimum score remains 0
    employee.score = Math.max(0, (employee.score || 0) - 5);
    await employee.save();

    res.json({ message: "Score updated", updatedScore: employee.score });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/accept/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params; // Get employeeId from URL parameter

    let employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Deduct 5 points, ensuring minimum score remains 0
    employee.score = Math.max(0, (employee.score || 0) + 5);
    await employee.save();

    res.json({ message: "Score updated", updatedScore: employee.score });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/count", async (req, res) => {
  try {
    const { role } = req.query;
    const totalEmployees = await User.countDocuments({ role: role || "agent" });
    res.json({ total: totalEmployees });
  } catch (error) {
    res.status(500).json({ error: "Error fetching employee count" });
  }
});

router.get("/departments", async (req, res) => {
  try {
    const departments = await User.aggregate([
      {
        $match: { role: "agent" }, // Only count employees with role 'agent'
      },
      {
        $group: {
          _id: "$department",
          employeeCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id", // Rename _id to name
          employeeCount: 1,
        },
      },
    ]);

    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
