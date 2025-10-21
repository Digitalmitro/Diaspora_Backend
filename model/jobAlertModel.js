import mongoose from "mongoose";
import { ModelNames } from "./modelNames.js";
import { UserModel } from "./authModel.js";
import softDeletePlugin from "../plugins/softDelete.plugin.js";

const JobAlertSchema = new mongoose.Schema({
  jobSeekerId: { type: mongoose.Schema.Types.ObjectId, ref: UserModel.modelName, required: true },
  title: { type: String, required: true, trim: true },
  location: { type: String, trim: true },
  skills: { type: [String], default: [] },
  jobType: { type: [String], default: [] },
  salaryMin: { type: Number, min: 0 },
  frequency: { type: String, enum: ["daily", "weekly"], default: "weekly" },
  lastSent: { type: Date },
}, { timestamps: true });

JobAlertSchema.plugin(softDeletePlugin);

export const JobAlertModel = mongoose.model(ModelNames.JOB_ALERT, JobAlertSchema);
export default JobAlertModel;
