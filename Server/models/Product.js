// Server/models/Product.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },

    // 描述：不是必填，默认空串
    description: { type: String, default: "" },

    price: { type: Number, required: true, min: 0, default: 0 },

    category: {
      type: String,
      enum: ["Outerwear", "Bottoms", "Activewear", "Footwear", "Accessories"],
      required: true,
    },

    // 图片：不是必填，默认空串
    image: { type: String, default: "" },

    stock: { type: Number, required: true, min: 0, default: 0 },

    isActive: { type: Boolean, default: true },

    createdAt: { type: Date, default: Date.now },

    // 如果以后要记录创建者，类型要用 Schema.Types.ObjectId
    // createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { versionKey: false }
);

// 可以做个全文索引，供模糊搜索
ProductSchema.index({ name: "text" });

export const Product = mongoose.model("Product", ProductSchema, "products");
