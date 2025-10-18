import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, require: true },
  description: { type: String, require: true },
  price: { type: Number, require: true, min: 0, default: 0 },
  category: {
    type: String,
    require: true,
    enum: ["Outwear", "Bottoms", "Activewear", "Footwear", "Accessories"],
  },
  stock: { type: Number, require: true, min: 0, default: 0 },
  imageURL: { type: String, require: true },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

ProductSchema.index({ name: "text" });

export const Product = mongoose.model("Product", ProductSchema, "products");
