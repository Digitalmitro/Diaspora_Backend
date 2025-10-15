import mongoose from "mongoose";

const JobAlertSchema = new mongoose.Schema(
    {
        jobSeekerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        location: {
            type: String,
            trim: true,
        },
        skills: {
            type: [String],
            default: [],
        },
        jobType: {
            type: [String],
            default: [],
        },
        salaryMin: {
            type: Number,
            min: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        frequency: {
            type: String,
            enum: ["daily", "weekly"],
            default: "weekly",
        },
        lastSent: {
            type: Date,
        },
    },
    { timestamps: true }
);

export default mongoose.model("JobAlert", JobAlertSchema);
