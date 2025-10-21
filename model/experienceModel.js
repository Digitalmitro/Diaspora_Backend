import mongoose from "mongoose";
import { ModelNames } from "./modelNames.js";
import { JobSeekerProfileModel } from "./jobSeekerProfileModel.js";
import softDeletePlugin from "../plugins/softDelete.plugin.js";

const ExperienceSchema = new mongoose.Schema({
  jobSeekerId: { type: mongoose.Schema.Types.ObjectId, ref: JobSeekerProfileModel.modelName, required: true, index: true },
  jobTitle: { type: String, required: true, trim: true, index: true },
  company: { type: String, required: true, trim: true, index: true },
  location: { type: String, trim: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  currentlyWorking: { type: Boolean, default: false },
  description: { type: String, maxlength: 1000 },
}, { timestamps: true });

ExperienceSchema.index({ jobSeekerId: 1, company: 1 });
ExperienceSchema.index({ jobSeekerId: 1, startDate: -1 });

ExperienceSchema.pre('save', function (next) {
  if (!this.currentlyWorking && this.endDate && this.startDate) {
    if (this.endDate < this.startDate) {
      next(new Error('End date must be after start date'));
    }
  }
  next();
});

ExperienceSchema.plugin(softDeletePlugin);

export const ExperienceModel = mongoose.model(ModelNames.EXPERIENCE, ExperienceSchema);
export default ExperienceModel;
