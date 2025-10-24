// Server/routers/productRouter.js
import express from "express";
import {
  get_products,
  get_search,
  get_productById,
  create_product,
} from "../controllers/productController.js";

const router = express.Router();

router.route("/")
  .get(get_products)
  .post(create_product);

router.route("/search").get(get_search);
router.route("/:id").get(get_productById);

export default router;
