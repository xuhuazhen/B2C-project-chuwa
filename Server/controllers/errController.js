import { AppError } from '../utils/appError.js';

const sendError = (err, req, res) => {
  console.log(err);
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
};

export default (err, req, res, next) => {
    console.log(err);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    let error = { ...err };
    error.message = err.message;
    sendError(error, req, res);
}
