import express from "express";
<<<<<<< HEAD
import {
  get_products,
  get_search,
 // getID,
} from "../controllers/productController.js";
=======
import { get_products, get_search } from "../controllers/productController.js";
>>>>>>> shunali

const router = express.Router();

router.route("/").get(get_products);
router.route("/search").get(get_search);
<<<<<<< HEAD
// router.route("/:id").get(getID);
=======
>>>>>>> shunali

export default router;
