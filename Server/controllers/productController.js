import { catchAsync } from "../utils/catchAsync.js";
import { Product } from "../models/Product.js";
import { APIFeatures } from "../utils/apiFeatures.js";
import { AppError } from "../utils/appError.js";
import mongoose from "mongoose";

/**
 * GET /api/products
 * 列表（分页 + 排序）
 * 支持 query: page, limit, sort
 */
export const get_products = catchAsync(async (req, res, next) => {
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

/**
 * GET /api/products/search?q=xxx
 * 名称模糊搜索（不区分大小写），最多返回 10 条，字段仅返回 _id + name
 */
export const get_search = catchAsync(async (req, res, next) => {
  const query = req.query.q || "";

  if (!query.trim()) {
    return res.status(200).json({
      status: "success",
      results: 0,
      products: [],
    });
  }

  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escapeRegex(query), "i");

  const products = await Product.find({ name: { $regex: regex } })
    .limit(8)
    .select("name _id")
    .lean();

  res.status(200).json({
    status: "success",
    results: products.length,
    products,
  });
});

/**
 * GET /api/products/:id
 * 详情
 */
export const get_productById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid product id", 400));
  }

  const product = await Product.findById(id).lean();
  if (!product) return next(new AppError("Product not found", 404));

  res.status(200).json({ status: "success", product });
});

/**
 * POST /api/products
 * 创建
 * body: { name, price, description, image, category, brand, stock }
 * 请与 models/Product.js 的字段保持一致
 */
export const create_product = catchAsync(async (req, res, next) => {
  const {
    name,
    price,
    description,
    image, // 如果是多图，改为 images: [String]
    category,
    brand,
    stock,
  } = req.body;

  // 基础校验
  if (!name || typeof name !== "string") {
    return next(new AppError("name is required", 400));
  }
  if (price == null || isNaN(Number(price)) || Number(price) < 0) {
    return next(new AppError("price must be a non-negative number", 400));
  }
  if (stock != null && (isNaN(Number(stock)) || Number(stock) < 0)) {
    return next(new AppError("stock must be a non-negative integer", 400));
  }

  // （可选）名称去重：根据你的业务决定是否保留
  const existed = await Product.findOne({ name: name.trim() }).lean();
  if (existed) {
    return next(new AppError("Product name already exists", 409));
  }

  const doc = await Product.create({
    name: name.trim(),
    price: Number(price),
    description: description?.trim() || "",
    image: image || "", // 或 images: []
    category: category?.trim() || "",
    brand: brand?.trim() || "",
    stock: stock != null ? Number(stock) : 0,
  });

  res.status(201).json({
    status: "success",
    product: doc,
  });
});
