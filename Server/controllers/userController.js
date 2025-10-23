import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from '../utils/appError.js';
import { User } from "../models/User.js";
import { Product } from "../models/Product.js"
import { DiscountCode } from "../models/DiscountCode.js"

// validate stock
export const post_validateCartStock = catchAsync(async (req, res, next) => {
    const { cartItems } = req.body; 

    if ( !cartItems  || cartItems.length === 0) return  next(new AppError('Cart is empty', 400));

    const productIds = cartItems.map(item => item.product);
    const products = await Product.find({ _id: { $in: productIds } });

    const stockErrors = [];

    for (const item of cartItems) {
        const product = products.find(prod => prod._id.toString() === item.product);

        if (!product || product.stock < item.quantity) {
            stockErrors.push(item.product);
        }
    } 

    if (stockErrors.length > 0) {
        return res.status(400).json({
            status: 'fail',
            message: 'Some items are out of stock',
            data: stockErrors,  
        });
    }

    res.status(200).json({
        status: 'success'
    });
});

//validate promo code
export const post_validateCode = catchAsync(async (req, res, next) => {
    const { code }  = req.body;

    console.log('checking promo');
    if (!code) return next();

    const formatCode = code.toUpperCase();  
    
    const discount = await DiscountCode.findOne({ code: formatCode });

    if (!discount) return next(new AppError('Code is not valid', 404));

    if (!discount.isActive) {
        return next(new AppError('This code is no longer active', 400));
    }
    //check if this code is stil valid
    const now = new Date();
    if (discount.validUntil && discount.validUntil < now) {  
        discount.isActive = false;
        await discount.save();

        return next(new AppError('This code has expired', 400));
    }

    res.status(201).json({
        status: 'success',
        data: { 
            code: discount.code,
            discountRate: Number(discount.discountRate) 
        }
    });
});

export const post_shoppingCart = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const { cart } = req.body;
    
     const user = await User.findByIdAndUpdate(
        id,
        { cart },
        { new: true, runValidators: true } // need! return updated data 
    ).populate('cart.product');   
    
    if (!user) return next(new AppError('No user found', 404));
    console.log('update cart success',cart, user.cart);

    res.status(201).json({
        status: 'success',
        data: { cart: user.cart }
    });
}); 