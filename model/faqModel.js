import mongoose from "mongoose";
import { ModelNames } from "./modelNames.js";
import softDeletePlugin from "../plugins/softDelete.plugin.js";

const FAQSchema = new mongoose.Schema({
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true },
    category: { type: String, required: true, trim: true },
    order: { type: Number, default: 0, index: true },
}, { timestamps: true });

FAQSchema.plugin(softDeletePlugin);

export const FAQModel = mongoose.model(ModelNames.FAQ, FAQSchema);
export default FAQModel;
