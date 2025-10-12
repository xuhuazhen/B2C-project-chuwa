import validator from 'validator';
import jwt from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync.js';
import { AppError } from '../utils/appError.js';
import { User } from '../models/User.js'; 

//make user has permission
export const roleValidation = (role) => {
    catchAsync(async (req, res, next) =>  {
        if (req.user.role !== role) {
            return next(
                new AppError('You do not have permission to perform this action', 403)
            );
        }
        next();
    });
}

// Make sure token is valid
export const jwtValidation = catchAsync(async (req, res, next) => {
    // get token from cookie
    const token = req.cookies.token;

    //decode token 
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const curUser = await User.findById(decoded.id); 

    if (!curUser) {
        return next(
            new AppError('The user belonging to this token does no longer exist.', 401)
        );
    }
    // assign data inside the token to the request body so that we can directly access these data in the request object in the route handler functions
    req.user = {
        userId: decoded.id,
        username: decoded.username,
        role: decoded.role,
    };

    next();
});

// Make sure user login
export const statusValidation = catchAsync(async (req, res, next) => {
    let token = req.cookies.token ? req.cookies.token : null;

    if (!token) {
        return next(
            new AppError('You are not logged in! Please log in to get access.', 401)
        );
    }
    
    next();
});