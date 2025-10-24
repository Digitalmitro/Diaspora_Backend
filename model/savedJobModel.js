import mongoose from "mongoose";
import { ModelNames } from "./modelNames.js";
import { UserModel } from "./authModel.js";
import { JobModel } from "./jobModel.js";
import softDeletePlugin from "../plugins/softDelete.js";

const SavedJobSchema = new mongoose.Schema({
  jobSeekerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: UserModel.modelName, 
    required: true, 
    index: true 
  },
  jobId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: JobModel.modelName, 
    required: true, 
    index: true 
  },
  savedAt: { 
    type: Date, 
    default: Date.now 
  },
  notes: { 
    type: String, 
    trim: true,
    maxlength: 500 
  }
}, { timestamps: true });

SavedJobSchema.index({ jobSeekerId: 1, jobId: 1 }, { unique: true });

SavedJobSchema.plugin(softDeletePlugin);

export const SavedJobModel = mongoose.model(ModelNames.SAVED_JOB, SavedJobSchema);
export default SavedJobModel;
