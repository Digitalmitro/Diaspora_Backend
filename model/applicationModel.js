import mongoose from "mongoose";
import { ModelNames } from "./modelNames.js";
import { JobModel } from "./jobModel.js";
import softDeletePlugin from "../plugins/softDelete.js";
import { VALID_APPLICATION_STATUSES, SKILLS_MATCH_SCORE } from "../validators/applicationValidator.js";

const ApplicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: JobModel.modelName, required: true },
    jobSeekerId: { type: mongoose.Schema.Types.ObjectId, ref: ModelNames.USER, required: true, index: true },
    resumeUrl: { type: String, required: true, trim: true },
    coverLetter: { type: String, trim: true },
    status: { type: String, enum: VALID_APPLICATION_STATUSES, default: "applied", index: true },
    skillsMatchScore: { type: Number, min: SKILLS_MATCH_SCORE.MIN, max: SKILLS_MATCH_SCORE.MAX, default: 0 },
    appliedAt: { type: Date, default: Date.now },
}, { timestamps: true });

ApplicationSchema.plugin(softDeletePlugin);

export const ApplicationModel = mongoose.model(ModelNames.APPLICATION, ApplicationSchema);
export default ApplicationModel;
