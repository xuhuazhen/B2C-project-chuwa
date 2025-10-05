import { catchAsync } from '../utils/catchAsync.js';
import { Product } from '../modles/Product.js';

export const get_products = catchAsync(async (req, res, next) => {
    const products = await Product.find({ isActive: true })
        .sort({ createdAt: -1 });
    
    res.status(200).json({
        status: 'success',
        message: products.length === 0 ? 'list is empty' : '',
        products
    })
});
