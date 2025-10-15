import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
    {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        jobSeekerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        resumeUrl: {
            type: String,
            required: true,
            trim: true,
        },
        coverLetter: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ["applied", "shortlisted", "rejected", "interviewed"],
            default: "applied",
            index: true,
        },
        skillsMatchScore: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
        appliedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Application", ApplicationSchema);
