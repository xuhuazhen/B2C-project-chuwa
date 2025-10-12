import { catchAsync } from "../utils/catchAsync.js";
import { Product } from "../modles/Product.js";

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

  //   console.log("Found products:", products);

  const products = await Product.find({
    name: { $regex: regex },
    isActive: true,
  })
    .limit(10)
    .select("name -_id")
    .lean();

  res.status(200).json({
    status: "success",
    products,
  });
});
