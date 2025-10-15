import mongoose from "mongoose";

const StaticPageSchema = new mongoose.Schema({
    pageType: {
        type: String,
        enum: ["privacy", "terms", "about", "contact"],
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    lastUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    lastUpdatedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("StaticPage", StaticPageSchema);
