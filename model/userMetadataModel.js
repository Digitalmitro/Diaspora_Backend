import mongoose from "mongoose";
import { ModelNames } from "./modelNames.js";
import { UserModel } from "./authModel.js";
import softDeletePlugin from "../plugins/softDelete.js";

const UserMetadataSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: UserModel.modelName,
        required: true,
        unique: true,
        index: true
    },

    voidVariables: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: new Map()
    },

    preferences: {
        notifications: { type: Boolean, default: true },
        emailUpdates: { type: Boolean, default: true },
        language: { type: String, default: "en" },
        theme: { type: String, enum: ["light", "dark", "auto"], default: "auto" }
    },

    lastLoginAt: { type: Date, default: null, index: true },
    lastActivityAt: { type: Date, default: null },
    loginCount: { type: Number, default: 0 },

    lastLoginDevice: {
        type: { type: String, default: null },
        browser: { type: String, default: null },
        os: { type: String, default: null },
        ip: { type: String, default: null }
    },

    isOnline: { type: Boolean, default: false, index: true },
    isSuspended: { type: Boolean, default: false },
    suspensionReason: { type: String, default: null },

    customFields: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: new Map()
    }

}, { timestamps: true });

UserMetadataSchema.plugin(softDeletePlugin);

UserMetadataSchema.methods.setVoidVariable = function (key, value) {
    this.voidVariables.set(key, value);
    return this.save();
};

UserMetadataSchema.methods.getVoidVariable = function (key) {
    return this.voidVariables.get(key);
};

UserMetadataSchema.methods.deleteVoidVariable = function (key) {
    this.voidVariables.delete(key);
    return this.save();
};

UserMetadataSchema.methods.updateActivity = function () {
    this.lastActivityAt = new Date();
    return this.save();
};

UserMetadataSchema.methods.recordLogin = function (deviceInfo = {}) {
    this.lastLoginAt = new Date();
    this.lastActivityAt = new Date();
    this.loginCount += 1;
    this.isOnline = true;

    if (deviceInfo) {
        this.lastLoginDevice = {
            type: deviceInfo.type || null,
            browser: deviceInfo.browser || null,
            os: deviceInfo.os || null,
            ip: deviceInfo.ip || null
        };
    }

    return this.save();
};

UserMetadataSchema.statics.findByVoidVariable = async function (key, value) {
    const query = {};
    query[`voidVariables.${key}`] = value;
    return await this.findOne(query);
};

export const UserMetadataModel = mongoose.model(ModelNames.USER_METADATA, UserMetadataSchema);
export default UserMetadataModel;
