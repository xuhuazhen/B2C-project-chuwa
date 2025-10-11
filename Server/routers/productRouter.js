import express from 'express';
import { get_products } from '../controllers/productController.js';

const router = express.Router();

router.route('/').get(get_products);

export default router;