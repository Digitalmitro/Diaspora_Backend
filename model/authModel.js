import mongoose from "mongoose";
import { ModelNames } from "./modelNames.js";
import softDeletePlugin from "../plugins/softDelete.plugin.js";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ["jobseeker", "employer", "admin"], default: "jobseeker", index: true },
  isVerified: { type: Boolean, default: false, index: true },
  isActive: { type: Boolean, default: true, index: true },
}, { timestamps: true });

UserSchema.plugin(softDeletePlugin);

export const UserModel = mongoose.model(ModelNames.USER, UserSchema);
export default UserModel;
