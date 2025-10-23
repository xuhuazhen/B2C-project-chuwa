import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from '../utils/appError.js';
import { User } from "../models/User.js";
import { DiscountCode } from "../models/DiscountCode.js"

//validate promo code
export const post_validateCode = catchAsync(async (req, res, next) => {
    const { code }  = req.body;
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