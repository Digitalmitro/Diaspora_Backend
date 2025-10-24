import mongoose from "mongoose";
import { ModelNames } from "./modelNames.js";
import softDeletePlugin from "../plugins/softDelete.js";

const JobSchema = new mongoose.Schema({
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: ModelNames.USER, required: true, index: true },
    title: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    location: { type: String, required: true, trim: true, index: true },
    isRemote: { type: Boolean, default: false },
    experienceRequired: { type: Number, required: true, min: 0 },
    skills: {
        type: [{
            name: { type: String, required: true, trim: true },
            level: { type: String, enum: ["beginner", "intermediate", "advanced", "expert"], default: "intermediate" },
            isRequired: { type: Boolean, default: true },
        }],
        required: true,
        default: [],
        index: true
    },
    education: { type: String, required: true, trim: true },
    educationPreferences: {
        minimumDegree: {
            type: String,
            enum: ["highschool", "diploma", "bachelor", "master", "phd"],
            default: "bachelor"
        },
        preferredInstitutions: {
            type: [String],
            default: []
        },
        preferredFieldsOfStudy: {
            type: [String],
            default: []
        },
        institutionType: {
            type: String,
            enum: ["any", "tier1", "tier2", "tier3", "iit", "nit", "iiit", "ivy_league", "top_universities"],
            default: "any"
        },
        isStrict: {
            type: Boolean,
            default: false
        }
    },
    salary: {
        min: { type: Number, required: true, min: 0 },
        max: { type: Number, required: true, min: 0 },
        currency: { type: String, required: true, default: "USD", trim: true },
    },
    jobType: { type: String, enum: ["fulltime", "parttime", "internship", "contract"], required: true },
    openings: { type: Number, required: true, min: 1, default: 1 },
    perks: {
        type: [{
            name: { type: String, required: true, trim: true },
            description: { type: String, trim: true },
            icon: { type: String, trim: true },
        }],
        default: []
    },
    status: { type: String, enum: ["draft", "pending", "active", "closed", "rejected"], default: "draft", index: true },
    isFeatured: { type: Boolean, default: false },
    rejectionReason: { type: String, default: null },
    expiresAt: { type: Date, default: null },
}, { timestamps: true });

JobSchema.plugin(softDeletePlugin);

export const JobModel = mongoose.model(ModelNames.JOB, JobSchema);
export default JobModel;
