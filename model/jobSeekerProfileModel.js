import mongoose from "mongoose";
import { ModelNames } from "./modelNames.js";
import { UserModel } from "./authModel.js";
import softDeletePlugin from "../plugins/softDelete.js";

const JobSeekerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: UserModel.modelName, required: true, unique: true },
  fullName: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  resumeUrl: { type: String, default: null },
  resume: {
    url: { type: String },
    path: { type: String },
    filename: { type: String },
    originalname: { type: String },
    size: { type: Number },
    mimetype: { type: String },
    uploadedAt: { type: Date }
  },
  skills: { type: [String], default: [] },
  experiences: [{ type: mongoose.Schema.Types.ObjectId, ref: ModelNames.EXPERIENCE }],
  education: [{
    degree: { type: String, trim: true },
    institution: { type: String, trim: true },
    fieldOfStudy: { type: String, trim: true },
    startDate: { type: Date },
    endDate: { type: Date },
    currentlyStudying: { type: Boolean, default: false },
    grade: { type: String, trim: true },
  }],
  preferredLocations: { type: [String], default: [] },
  bio: { type: String, maxlength: 500 },
  profilePicture: { type: String, default: null },
}, { timestamps: true });

JobSeekerProfileSchema.plugin(softDeletePlugin);

export const JobSeekerProfileModel = mongoose.model(ModelNames.JOB_SEEKER_PROFILE, JobSeekerProfileSchema);
export default JobSeekerProfileModel;
