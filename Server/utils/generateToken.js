import jwt from 'jsonwebtoken';

export const generateToken =  ( id, email, role) => {
    const token = jwt.sign(
        { id, email, role },
        process.env.ACCESS_TOKEN_SECRET,
        {
        expiresIn: '3h',
        }
    );
    return token;
};

