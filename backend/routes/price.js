// routes/price.js or in your services route

const express = require("express");
const router = express.Router();
const Skill = require("../models/Skill"); // assuming you have this
const TeamServiceTemplate = require("../models/TeamServiceTemplate");
const FIXED_GST = 0.18; // 18% GST

router.post("/calculate-price", async (req, res) => {
  try {
    const { skillId, duration } = req.body;

    const skillData = await Skill.findById(skillId);
    const teamServiceData = await TeamServiceTemplate.findById(skillId);

    const skill = !skillData ? teamServiceData : skillData;
    console.log(skill);
    if (!skill) return res.status(404).json({ error: "Skill not found" });

    // const basePrice = skill.pricePerHour * duration;
    const gstAmount = skillData
      ? skill.basePrice * FIXED_GST
      : teamServiceData.basePrice * FIXED_GST;

    const totalPrice = skillData
      ? skill.basePrice + gstAmount
      : teamServiceData.basePrice + gstAmount;

    if (skillData) {
      res.json({
        skill: skill.name,
        duration,
        basePrice,
        gstAmount,
        totalPrice,
      });
    } else {
      res.json({
        skill: teamServiceData.service_name,
        duration: teamServiceData.completion_time,
        basePrice,
        gstAmount,
        totalPrice,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
