//A higher-order function that wraps async route handlers and forwards any errors to Express' global error handler.
export const catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};