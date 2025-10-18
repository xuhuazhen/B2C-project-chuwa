// Server/routers/productRouter.js
import express from "express";
import { get_products, get_search } from "../controllers/productController.js";

const router = express.Router();

router.route("/").get(get_products);
router.route("/search").get(get_search);

export default router;
