import express from "express";
import {
  get_products,
  get_search,
 // getID,
} from "../controllers/productController.js";

const router = express.Router();

router.route("/").get(get_products);
router.route("/search").get(get_search);
// router.route("/:id").get(getID);

export default router;
