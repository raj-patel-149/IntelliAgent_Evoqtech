// Node.js Express Route
const express = require("express");
const Skill = require("../models/Skill");
const TeamServiceTemplate = require("../models/TeamServiceTemplate");
const router = express.Router();
const FIXED_GST = 0.18;

const SERVICE_CENTER = {
  // lat: 21.1702, // example: Surat
  // lng: 72.8311,
  // lat: 23.0219411,
  // lng: 72.5090304
  lat: 23.027,
  lng: 72.5063,
};

// Haversine Formula to calculate distance in km
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in KM
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // in kilometers
}

// Pricing logic
function calculateCharge(distanceKm) {
  if (distanceKm <= 5) return 0;
  if (distanceKm <= 10) return 10;
  return 10 + distanceKm * 3; // extra per km
}

router.post("/calculate-price", async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const { id } = req.body;
    const skillData = await Skill.findById(id);
    const teamServiceData = await TeamServiceTemplate.findById(id);

    const skill = !skillData ? teamServiceData : skillData;
    if (!skill) return res.status(404).json({ error: "Skill not found" });

    if (!lat || !lng) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude required" });
    }
    // const basePrice = skill.pricePerHour * duration;

    const distance = getDistance(
      SERVICE_CENTER.lat,
      SERVICE_CENTER.lng,
      lat,
      lng
    );
    const distCost = calculateCharge(distance);

    const gstAmount = skillData
      ? skill.basePrice * FIXED_GST
      : teamServiceData.basePrice * FIXED_GST;

    const totalPrice = skillData
      ? skill.basePrice + gstAmount
      : teamServiceData.basePrice + gstAmount;

    const resp = {
      skill: skillData ? skill.skill_Name : skill.service_name,
      duration: skillData ? skill.duration.value : skill.completion_time,
      distance: distance.toFixed(2),
      basePrice: skill.basePrice,
      gstAmount: gstAmount,
      distCost: distCost.toFixed(2),
      totalPrice: totalPrice.toFixed(2),
    };
    console.log("totalPrice", resp);

    res.json({
      success: true,
      message: "price calculated ",
      resp,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
