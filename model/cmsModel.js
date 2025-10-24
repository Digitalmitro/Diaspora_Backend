import mongoose from "mongoose";
import { ModelNames } from "./modelNames.js";
import softDeletePlugin from "../plugins/softDelete.js";

const CMSPageSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String },
  content: { type: String },
  banner: { type: String },
  secondaryImage: { type: String },
  home: {
    bannerSection: {
      bannerImage: { type: String },
      title: { type: String }
    },
    jobCategorySection: {
      title: { type: String },
      description: { type: String }
    },
    blogSection: {
      title: { type: String },
      description: { type: String }
    },
    jobsSection: {
      title: { type: String },
      description: { type: String }
    },
    secondBannerSection: {
      bannerImage: { type: String },
      title: { type: String },
      description: { type: String }
    }
  },
  updatedAt: { type: Date, default: Date.now }
});

CMSPageSchema.plugin(softDeletePlugin);

export const CMSModel = mongoose.model(ModelNames.CMS, CMSPageSchema);
export default CMSModel;
