import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0, default: 0 },
  category: {
    type: String,
    enum: ["Outerwear", "Bottoms", "Activewear", "Footwear", "Accessories"],
  },
  type: { type: String },
  stock: { type: Number, required: true, min: 0, default: 0 },
  image: { type: String, required: true },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false, // ⚠️ 改为 false
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

ProductSchema.index({ name: "text" });

export const Product = mongoose.model("Product", ProductSchema, "products");
