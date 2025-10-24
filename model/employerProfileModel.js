import mongoose from "mongoose";
import { ModelNames } from "./modelNames.js";
import { UserModel } from "./authModel.js";
import softDeletePlugin from "../plugins/softDelete.js";

const EmployerProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: UserModel.modelName, required: true, unique: true },
    companyName: { type: String, required: true, trim: true },
    industry: { type: String, trim: true },
    website: { type: String, trim: true },
    verificationDocUrl: { type: String, default: null },
    verificationStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    employeeCount: { type: String, trim: true },
    description: { type: String, maxlength: 1000 },
    logo: { type: String, default: null },
}, { timestamps: true });

EmployerProfileSchema.plugin(softDeletePlugin);

export const EmployerProfileModel = mongoose.model(ModelNames.EMPLOYER_PROFILE, EmployerProfileSchema);
export default EmployerProfileModel;
