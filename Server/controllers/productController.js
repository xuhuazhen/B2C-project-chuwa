import { catchAsync } from "../utils/catchAsync.js";
import { Product } from "../models/Product.js";
import { AppError } from "../utils/appError.js"; 

export const get_products = catchAsync(async (req, res, next) => {
  const products = await Product.find({ isActive: true }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    status: "success",
    message: products.length === 0 ? "list is empty" : "",
    products,
  });
});

//Return Search Results
export const get_search = catchAsync(async (req, res, next) => {
  const query = req.query.q || "";

  if (!query.trim()) {
    return res.status(200).json({
      status: "success",
      products: [],
    });
  }

  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escapeRegex(query), "i");

  const products = await Product.find({
    $or: [
      { name: { $regex: regex } },
      { description: { $regex: regex } },
      { category: { $regex: regex } },
    ],
  })
    .limit(10)
    .lean(); // Keep lean() for performance (returns plain JS objects)

  res.status(200).json({
    status: "success",
    results: products.length,
    products,
  });
});
export const get_productById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) return next(new AppError("Product not found", 404));
  res.status(200).json({ status: "success", product });
});