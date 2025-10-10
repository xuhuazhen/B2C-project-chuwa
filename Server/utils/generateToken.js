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

export const generateRestToken = (email) => {
    const token = jwt.sign(
        { email }, 
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '3h'}
    );
    return token;
}