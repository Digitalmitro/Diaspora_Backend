import mongoose from "mongoose";
import { ModelNames } from "./modelNames.js";
import { UserModel } from "./authModel.js";
import { SubscriptionPlanModel } from "./subscriptionPlanModel.js";
import softDeletePlugin from "../plugins/softDelete.js";

const SubscriptionSchema = new mongoose.Schema({
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: UserModel.modelName, required: true, index: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: SubscriptionPlanModel.modelName, required: true },
  billingCycle: { type: String, enum: ["monthly", "yearly"], required: true },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, required: true, default: "USD", trim: true },
  startDate: { type: Date, required: true, default: Date.now },
  endDate: { type: Date, required: true, index: true },
  status: { type: String, enum: ["active", "cancelled", "expired", "pending"], default: "pending", index: true },
  autoRenew: { type: Boolean, default: true },
}, { timestamps: true });

SubscriptionSchema.plugin(softDeletePlugin);

export const SubscriptionModel = mongoose.model(ModelNames.SUBSCRIPTION, SubscriptionSchema);
export default SubscriptionModel;
