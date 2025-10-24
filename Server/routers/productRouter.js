// Server/routers/productRouter.js
import express from "express";
import {
  get_products,
  get_search,
  get_productById,
  create_product,
  post_product,
} from "../controllers/productController.js";
import { roleValidation, validation } from "../middlewares/userMiddleware.js";

const router = express.Router();

router.route("/")
  .get(get_products)
  .post(create_product);

router.route("/search").get(get_search);
router.route("/:id")
  .get(get_productById)
  .post(validation, roleValidation('admin'), post_product);

export default router;
