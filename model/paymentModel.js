import mongoose from "mongoose";
import { ModelNames } from "./modelNames.js";
import { UserModel } from "./authModel.js";
import { SubscriptionModel } from "./subscriptionModel.js";
import softDeletePlugin from "../plugins/softDelete.plugin.js";

const PaymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: UserModel.modelName, required: true },
    subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: SubscriptionModel.modelName, required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: "USD", trim: true },
    paymentMethod: { type: String, enum: ["stripe", "paypal"], required: true },
    transactionId: { type: String, required: true, unique: true, trim: true },
    status: { type: String, enum: ["pending", "completed", "failed", "refunded"], default: "pending" },
    invoiceUrl: { type: String, trim: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

PaymentSchema.plugin(softDeletePlugin);

export const PaymentModel = mongoose.model(ModelNames.PAYMENT, PaymentSchema);
export default PaymentModel;
