const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Service name is required"],
            trim: true,
            unique: true,
            maxlength: [50, "Service name cannot exceed 50 characters"]
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
            maxlength: [500, "Description cannot exceed 500 characters"]
        },
        basePrice: {
            type: Number,
            required: [true, "Base price is required"],
            min: [0, "Price cannot be negative"]
        },
        currency: {
            type: String,
            default: "INR",
            enum: ["INR", "USD", "EUR"] // Supported currencies
        },
        duration: {
            value: { type: Number, default: 60 }, // Duration value
            unit: {
                type: String,
                enum: ["hour", "day", "session", "minutes"],
                default: "minutes"
            },
            required: true
        },
        category: {
            type: String,
            required: true,
            enum: ["home", "vehicle", "personal", "health", "other"]
        },
        image: {
            url: String,
            altText: String
        },
        isActive: {
            type: Boolean,
            default: true
        },
        department: {
            type: String,
            enum: ["cleaning", "repairs", "healthcare", "beauty", "other"],
            required: true
        },
        requirements: [{
            type: String // Equipment/skills needed
        }],
        tags: [{
            type: String
        }],
        location: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        contact: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active"
        },
        teamWork: {
            type: Boolean,
            default: false
        },

        providers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee" // Reference to service providers
        }],
        rating: {
            average: { type: Number, default: 0, min: 0, max: 5 },
            count: { type: Number, default: 0 }
        },
        terms: {
            cancellationPolicy: { type: String, required: true },
            serviceGuarantee: { type: String }
        },
        metadata: {
            createdAt: { type: Date, default: Date.now },
            updatedAt: { type: Date, default: Date.now },
            createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" }
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Update timestamp before saving
serviceSchema.pre("save", function (next) {
    this.metadata.updatedAt = new Date();
    next();
});

// Add text index for search
serviceSchema.index({
    name: "text",
    description: "text",
    category: "text",
    department: "text"
});

const Service = mongoose.models.Service || mongoose.model("Service", serviceSchema);

module.exports = Service;