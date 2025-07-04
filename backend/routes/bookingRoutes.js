const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const router = express.Router();
const Booking = require("../models/Booking"); // import model
const Order = require("../models/Order");
const User = require("../models/User");
const MoneyDistribution = require("../models/moneyDistribution");
const { sendEmail } = require("../utils/sendMail");
const { sendNotification } = require("../utils/sendNotification");
const Skill = require("../models/Skill"); // assuming you have this
const FIXED_GST = 0.18;

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
router.post("/create-order", async (req, res) => {
  const { amount, currency } = req.body;
  console.log(req.body, "create-order");

  const options = {
    amount: amount * 100, // convert to paise
    currency,
    receipt: "receipt_" + Date.now(),
  };

  try {
    const order = await razorpay.orders.create(options);
    // console.log("order created in backend:---", order);

    // Save order in your database
    const orderData = new Order({
      razorpayOrderId: order.id,
      amount: order.amount,
      amount_due: order.amount,
      currency: order.currency,
      entity: order.entity,
      receipt: order.receipt,
      status: order.status,
      user: req.body.user,
      service: req.body.service,
    });
    await orderData.save();
    res.json(order);
  } catch (err) {
    console.error("Order Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Verify Payment Signature
router.post("/verify-payment", async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    user,
    service,
    amount,
  } = req.body;

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    // Save booking
    const booking = new Booking({
      user,
      service,
      amount,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      status: "paid",
      case: req.body.case,
    });

    await booking.save();

    const moneyDistribution = new MoneyDistribution({
      booking: booking._id,
      amount: amount,
      managerAmount: amount * 0.1, // 10% for manager
      employeeAmount: amount * 0.9, // 90% for employee
    });

    await moneyDistribution.save();

    res.json({ success: true, message: "Payment verified and booking saved!" });
  } else {
    res
      .status(400)
      .json({ success: false, message: "Payment verification failed" });
  }
});

router.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/calculate-price", async (req, res) => {
  try {
    const { id } = req.body;
    console.log("skillId", req.body);

    const skill = await Skill.findById(id);
    if (!skill) return res.status(404).json({ error: "Skill not found" });

    // const basePrice = skill.pricePerHour * duration;
    const gstAmount = skill.basePrice * FIXED_GST;
    const totalPrice = skill.basePrice + gstAmount;

    const resp = {
      skill: skill.skill_Name,
      duration: skill.duration.value,
      basePrice: skill.basePrice,
      gstAmount: gstAmount,
      totalPrice,
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
