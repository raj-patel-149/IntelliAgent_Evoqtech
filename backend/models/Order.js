// models/Order.js

const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema({
    razorpayOrderId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    amount_due: { type: Number, required: true },
    amount_paid: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 },
    currency: { type: String, required: true },
    entity: { type: String, required: true },
    notes: { type: Array, default: [] },
    offer_id: { type: String },
    receipt: { type: String, required: true },
    status: { type: String, required: true },
    user: { type: String }, // Reference to user who created order
    service: { type: String }, // The service being booked
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
},
    { timestamps: true }
);

// Convert Razorpay timestamp to Date
orderSchema.pre('save', function (next) {
    if (this.isModified('created_at')) {
        this.created_at = new Date(this.created_at * 1000); // Convert Unix timestamp to Date
    }
    next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;