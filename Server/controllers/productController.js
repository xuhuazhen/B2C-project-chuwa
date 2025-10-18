// Server/controllers/productController.js
import { catchAsync } from "../utils/catchAsync.js";
import { Product } from "../modles/Product.js"; // 注意：你的项目里文件夹叫 modles

// GET /api/products  -> 获取产品列表（只要 isActive = true）
export const get_products = catchAsync(async (req, res, next) => {
  const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    message: products.length === 0 ? "list is empty" : "",
    products,
  });
});

// GET /api/products/search?q=xxx  -> 搜索
export const get_search = catchAsync(async (req, res, next) => {
  const query = (req.query.q || "").trim();

  if (!query) {
    return res.status(200).json({
      status: "success",
      products: [],
    });
  }

  // 转义正则特殊字符
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
    .lean();

  res.status(200).json({
    status: "success",
    results: products.length,
    products,
  });
});
