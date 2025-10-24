import mongoose from "mongoose";
import { ModelNames } from "./modelNames.js";
import softDeletePlugin from "../plugins/softDelete.js";

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
  content: { type: String, required: true },
  excerpt: { type: String, trim: true },
  imageUrl: { type: String, trim: true },
  author: { type: String, required: true, trim: true },
  tags: { type: [String], default: [] },
  status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
  publishedAt: { type: Date },
}, { timestamps: true });

BlogSchema.plugin(softDeletePlugin);

export const BlogModel = mongoose.model(ModelNames.BLOG, BlogSchema);
export default BlogModel;
