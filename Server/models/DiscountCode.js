import mongoose from "mongoose";
const Schema = mongoose.Schema;

const DiscountCodeSchema = new Schema({
  code: { type: String, require: true },
  discountRate: { type: String, require: true }, 
  validUntil: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

DiscountCodeSchema.index({ name: "text" });

export const DiscountCode = mongoose.model("DiscountCode", DiscountCodeSchema, "discountCodes");