import express from "express";
import {
  get_products,
  get_search,
  get_productById,
  create_product,
} from "../controllers/productController.js";

const router = express.Router();

// 列表 + 创建
router.route("/")
  .get(get_products)
  .post(create_product);

// 搜索
router.route("/search").get(get_search);

// 详情
router.route("/:id").get(get_productById);

export default router;
