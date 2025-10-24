import jwt from 'jsonwebtoken';
import { catchAsync } from '../utils/catchAsync.js'; 
import { AppError } from '../utils/appError.js';
import { User } from '../models/User.js'; 

//make user has permission
export const roleValidation = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) return next(new AppError('User not authenticated', 401));
    if (req.user.role !== requiredRole)
      return next(new AppError('You do not have permission to perform this action', 403));
    next();
  };
};

// Make sure token is valid
export const validation = catchAsync(async (req, res, next) => {
    console.log('verify')
    // get token from cookie
    const token = req.cookies?.token;
    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    //decode token & verify
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
        return next(new AppError('Invalid or expired token. Please log in again.', 401));
    }

    // check current user
    const curUser = await User.findById(decoded.id); 
    if (!curUser) {
        return next(
            new AppError('The user belonging to this token does no longer exist.', 401)
        );
    }

    // assign data inside the token to the request body so that we can directly access these data in the request object in the route handler functions
    req.user = {
        userId: curUser._id,
        email: curUser.email,
        role: curUser.role,
    };

    next();
});
 