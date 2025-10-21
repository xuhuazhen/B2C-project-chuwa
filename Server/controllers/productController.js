import { catchAsync } from "../utils/catchAsync.js";
import { Product } from "../models/Product.js";
import { APIFeatures } from "../utils/apiFeatures.js";

//Return products
export const get_products = catchAsync(async (req, res, next) => {
  console.log("REQ QUERY:", req.query);

  const features = new APIFeatures(Product.find(), req.query) //req.query = page,limit,sort,keyword
    .sort()
    .paginate();

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

//Return search results
export const get_search = catchAsync(async (req, res, next) => {
  const query = req.query.q || "";

  if (!query.trim()) {
    return res.status(200).json({
      status: "success",
      results: 0,
      products: [],
    });
  }

  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); //control special regex characters: escapeRegex("T-shirt.")  // => "T\-shirt\."
  const regex = new RegExp(escapeRegex(query), "i"); //control case sensitive

  const products = await Product.find({
    name: { $regex: regex }, //use name for comparison
  })
    .limit(10) //only return 10 results
    .select("name _id") //only return id and name of each product
    .lean(); // Keep lean() for performance (returns plain JS objects)

  res.status(200).json({
    status: "success",
    results: products.length,
    products,
  });
});
