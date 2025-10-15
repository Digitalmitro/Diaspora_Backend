import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
    {
        employerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        planId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubscriptionPlan",
            required: true,
        },
        billingCycle: {
            type: String,
            enum: ["monthly", "yearly"],
            required: true,
        },
        amount: {
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
        startDate: {
            type: Date,
            required: true,
            default: Date.now,
        },
        endDate: {
            type: Date,
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: ["active", "cancelled", "expired", "pending"],
            default: "pending",
            index: true,
        },
        autoRenew: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Subscription", SubscriptionSchema);
