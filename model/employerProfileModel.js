import mongoose from "mongoose";

const EmployerProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        companyName: {
            type: String,
            required: true,
            trim: true,
        },
        industry: {
            type: String,
            trim: true,
        },
        website: {
            type: String,
            trim: true,
        },
        verificationDocUrl: {
            type: String,
            default: null,
        },
        verificationStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        employeeCount: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            maxlength: 1000,
        },
        logo: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

export default mongoose.model("EmployerProfile", EmployerProfileSchema);
