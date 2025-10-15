import mongoose from "mongoose";

const SubscriptionPlanSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            enum: ["basic", "pro", "premium"],
            required: true,
            unique: true,
        },
        displayName: {
            type: String,
            required: true,
            trim: true,
        },
        monthlyPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        yearlyPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        currency: {
            type: String,
            required: true,
            default: "USD",
            trim: true,
        },
        features: {
            jobsAllowed: {
                type: Number,
                required: true,
                min: 0,
            },
            applicantsLimit: {
                type: Number,
                required: true,
                min: 0,
            },
            resumeViews: {
                type: mongoose.Schema.Types.Mixed,
                required: true,
            },
            analytics: {
                type: Boolean,
                default: false,
            },
            support: {
                type: String,
                required: true,
                trim: true,
            },
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("SubscriptionPlan", SubscriptionPlanSchema);
