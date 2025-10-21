import mongoose from "mongoose";
import { ModelNames } from "./modelNames.js";
import softDeletePlugin from "../plugins/softDelete.plugin.js";

const PartnerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  logoUrl: { type: String, required: true, trim: true },
  websiteUrl: { type: String, trim: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

PartnerSchema.plugin(softDeletePlugin);

export const PartnerModel = mongoose.model(ModelNames.PARTNER, PartnerSchema);
export default PartnerModel;
