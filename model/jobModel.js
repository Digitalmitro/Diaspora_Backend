import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
    {
        employerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        department: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        isRemote: {
            type: Boolean,
            default: false,
        },
        experienceRequired: {
            type: Number,
            required: true,
            min: 0,
        },
        skills: {
            type: [String],
            required: true,
            default: [],
            index: true,
        },
        education: {
            type: String,
            required: true,
            trim: true,
        },
        salary: {
            min: {
                type: Number,
                required: true,
                min: 0,
            },
            max: {
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
        },
        jobType: {
            type: String,
            enum: ["fulltime", "parttime", "internship", "contract"],
            required: true,
        },
        openings: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
        },
        perks: {
            type: [String],
            default: [],
        },
        status: {
            type: String,
            enum: ["draft", "pending", "active", "closed", "rejected"],
            default: "draft",
            index: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        rejectionReason: {
            type: String,
            default: null,
        },
        expiresAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Job", JobSchema);
