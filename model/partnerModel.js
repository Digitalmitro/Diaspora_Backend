import mongoose from "mongoose";

const PartnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    logoUrl: {
        type: String,
        required: true,
        trim: true,
    },
    websiteUrl: {
        type: String,
        trim: true,
    },
    order: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Partner", PartnerSchema);
