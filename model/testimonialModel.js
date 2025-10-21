import mongoose from "mongoose";
import { ModelNames } from "./modelNames.js";
import softDeletePlugin from "../plugins/softDelete.plugin.js";

const TestimonialSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
    quote: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

TestimonialSchema.plugin(softDeletePlugin);

export const TestimonialModel = mongoose.model(ModelNames.TESTIMONIAL, TestimonialSchema);
export default TestimonialModel;
