import { catchAsync } from "../utils/catchAsync.js";
import { Product } from "../models/Product.js";
import { APIFeatures } from "../utils/apiFeatures.js";
import { AppError } from "../utils/appError.js";
import mongoose from "mongoose";

// GET /api/products
export const get_products = catchAsync(async (req, res, next) => {
  console.log("[REQ QUERY]:", req.query);

  const features = new APIFeatures(Product.find(), req.query).sort().paginate();
  const products = await features.query.lean();
  const pagination = await features.getPaginationData(Product);

  res.status(200).json({
    status: "success",
    message: products.length === 0 ? "list is empty" : "",
    results: products.length,
    pagination,
    products,
  });
});

// GET /api/products/search?q=xx
export const get_search = catchAsync(async (req, res, next) => {
  const query = req.query.q || "";
  if (!query.trim()) {
    return res.status(200).json({ status: "success", results: 0, products: [] });
  }
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escapeRegex(query), "i");

  const products = await Product.find({ name: { $regex: regex } })
    .limit(10)
    .select("name _id")
    .lean();

  res.status(200).json({
    status: "success",
    results: products.length,
    products,
  });
});

// GET /api/products/:id
export const get_productById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid product id", 400));
  }
  const product = await Product.findById(id);
  if (!product) return next(new AppError("Product not found", 404));
  res.status(200).json({ status: "success", product });
});

// POST /api/products
export const create_product = catchAsync(async (req, res, next) => {
  console.log("✅ [create_product] hit");
  console.log("body:", req.body);

  const {
    name,
    description = "",
    category,
    price,
    stock,
    image,
    imageUrl,
    imageURL,
    img,
  } = req.body || {};

  if (!name || !category) {
    return next(new AppError("`name` and `category` are required.", 400));
  }

  const priceNum = Number(price);
  const stockNum = Number(stock);
  if (Number.isNaN(priceNum) || priceNum < 0) {
    return next(new AppError("`price` must be a non-negative number.", 400));
  }
  if (!Number.isInteger(stockNum) || stockNum < 0) {
    return next(new AppError("`stock` must be a non-negative integer.", 400));
  }

  const finalImage = image || imageUrl || imageURL || img || "";

  const product = await Product.create({
    name: String(name).trim(),
    description: String(description).trim(),
    category,
    price: priceNum,
    stock: stockNum,
    image: finalImage,
    isActive: true,
  });

  res.status(201).json({ status: "success", product });
});
