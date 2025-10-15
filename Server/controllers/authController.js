import { generateToken, generateRestToken } from '../utils/generateToken.js';
import { AppError } from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { User } from '../modles/User.js';
import * as argon2 from 'argon2';

export const post_resetPwd = catchAsync(async (req, res, next) => { 
    const user = await User.findOne(req.body);
    
    if (!user)  return next(new AppError('Email not found in our system', 404));

    const resetToken = generateRestToken();

    const resetURL = `http://localhost:5173/forgot-password"/${resetToken}`; //send email link
    console.log(`Click here: ${resetURL}`);

    res.status(200).json({
        status: "success",
        message: "Reset link sent successfully."
    });
});

export const post_signup = catchAsync(async (req, res, next) => {
    const { email, password, role } = req.body; 
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new AppError('Your email has already been used', 400));
    }

    const newUser = await User.create({
        email,
        password,
        role
    });
    
    const token = generateToken(newUser._id, newUser.email, newUser.role);
    res.cookie('token', token, { httpOnly: true, maxAge: 10800000 }); //expired after 3hrs

    newUser.password = undefined;

    res.status(201).json({
    status: 'success',
    data: { user: newUser },
  });
});

export const post_login = catchAsync(async (req, res, next) => {
    const {email, password} = req.body; 

    if (!email || !password) return next(new AppError('Please provide email and password!', 400));

    const user = await User.findOne({email})
        .populate('cart.product') // get cartitems' info
        .select('+password'); //find user with pwd

    if (!user) return next(new AppError('Incorrect email', 401));

    let isPwdCorrect = false;
    isPwdCorrect = await argon2.verify(user.password, password);
    
    // const isHashed = user.password.startsWith('$argon2');
    // if (isHashed) {
    //     // 如果是加密密码，用argon2验证
    //     isPwdCorrect = await user.correctPassword(user.password, password);
    // } else {
    //     // 否则说明是旧的明文密码
    //     isPwdCorrect = user.password === password;

    //     // 如果匹配成功，自动升级为hash
    //     if (isPwdCorrect) {
    //         user.password = await argon2.hash(password);
    //         await user.save();
    //         console.log(`✅ Password for ${user.email} upgraded to argon2 hash`);
    //     }
    // }
    
    if (!user || !isPwdCorrect) { 
        return next(new AppError('Incorrect email or password', 401));
    }

    const token = generateToken(user._id, user.email, user.role);
     
    res.cookie('token', token, { httpOnly: true, maxAge: 10800000 });

    user.password = undefined;
    res.status(200).json({
        status: 'success',
        data: { user },
    });
});

