import mongoose from "mongoose";
import { ModelNames } from "./modelNames.js";
import { UserModel } from "./authModel.js";
import softDeletePlugin from "../plugins/softDelete.plugin.js";

const StaticPageSchema = new mongoose.Schema({
    pageType: {
        type: String,
        enum: ["privacy", "terms", "about", "contact"],
        required: true,
        unique: true,
    },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: UserModel.modelName },
    lastUpdatedAt: { type: Date, default: Date.now },
    history: [{
        title: { type: String, required: true },
        content: { type: String, required: true },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: UserModel.modelName, required: true },
        updatedAt: { type: Date, default: Date.now, required: true },
        changeReason: { type: String, trim: true },
        ipAddress: { type: String },
        userAgent: { type: String },
    }],
}, { timestamps: true });

StaticPageSchema.pre('save', function (next) {
    if (!this.isNew && (this.isModified('title') || this.isModified('content'))) {
        const originalDoc = this.$locals.originalDoc;
        if (originalDoc) {
            this.history.push({
                title: originalDoc.title,
                content: originalDoc.content,
                updatedBy: this.lastUpdatedBy,
                updatedAt: this.lastUpdatedAt || new Date(),
                changeReason: this.$locals.changeReason || 'Content updated',
                ipAddress: this.$locals.ipAddress,
                userAgent: this.$locals.userAgent,
            });
        }
    }
    next();
});

StaticPageSchema.pre('findOneAndUpdate', async function (next) {
    try {
        const docToUpdate = await this.model.findOne(this.getQuery());
        if (docToUpdate) {
            const update = this.getUpdate();
            const updateData = update.$set || update;
            if (updateData.title || updateData.content) {
                const historyEntry = {
                    title: docToUpdate.title,
                    content: docToUpdate.content,
                    updatedBy: updateData.lastUpdatedBy,
                    updatedAt: new Date(),
                    changeReason: updateData.changeReason || 'Content updated',
                    ipAddress: updateData.ipAddress,
                    userAgent: updateData.userAgent,
                };
                if (!update.$push) update.$push = {};
                update.$push.history = historyEntry;
                delete updateData.changeReason;
                delete updateData.ipAddress;
                delete updateData.userAgent;
            }
        }
        next();
    } catch (error) {
        next(error);
    }
});

StaticPageSchema.methods.getHistory = function (options = {}) {
    const { limit, skip, sortOrder = -1 } = options;
    let history = [...this.history];
    history.sort((a, b) => sortOrder * (b.updatedAt - a.updatedAt));
    if (skip) history = history.slice(skip);
    if (limit) history = history.slice(0, limit);
    return history;
};

StaticPageSchema.methods.getVersionAt = function (date) {
    const history = this.history
        .filter(h => h.updatedAt <= date)
        .sort((a, b) => b.updatedAt - a.updatedAt);
    return history.length > 0 ? history[0] : null;
};

StaticPageSchema.methods.compareVersions = function (version1Index, version2Index) {
    const v1 = this.history[version1Index];
    const v2 = this.history[version2Index];
    if (!v1 || !v2) throw new Error('Invalid version indices');
    return {
        titleChanged: v1.title !== v2.title,
        contentChanged: v1.content !== v2.content,
        timeDifference: Math.abs(v1.updatedAt - v2.updatedAt),
        version1: v1,
        version2: v2,
    };
};

StaticPageSchema.statics.getChangesByUser = async function (userId) {
    return this.find({ 'history.updatedBy': userId })
        .populate('history.updatedBy', 'name email')
        .select('pageType title history');
};

StaticPageSchema.plugin(softDeletePlugin);

export const StaticPageModel = mongoose.model(ModelNames.STATIC_PAGE, StaticPageSchema);
export default StaticPageModel;
