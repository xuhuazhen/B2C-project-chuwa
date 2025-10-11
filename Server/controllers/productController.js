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

// GET /api/product/search?q=
export const get_search = catchAsync(async (req, res, next) => {
  const query = req.query.q;
  console.log("Search hit. Query:", query);

  if (!query?.trim()) {
    console.log("Empty query");
    return res.json([]);
  }

  const products = await Product.find(
    { name: { $regex: query, $options: "i" } },
    { name: 1 }
  ).limit(10);

  //   console.log("Found products:", products);

  res.status(200).json({
    status: "success",
    products,
  });
});
