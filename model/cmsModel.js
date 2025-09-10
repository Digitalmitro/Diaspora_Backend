import mongoose from "mongoose";

const CMSPageSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String},
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

export default mongoose.model("CMSPage", CMSPageSchema);
