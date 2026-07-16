//! wrapper class to wrap the functions

/**
 * @param {import('express').RequestHandler} fn //!this tells vs code that request handler comes from express
 */

//todo first approach
// const asyncHandler = (requestHandler) => {
//     return (req, res, next) => {
//         return Promise.resolve(requestHandler(req, res, next))
//         .catch((err) => next(err))
//     }
// }

//todo second approach
const asyncHandler = (fn) => async (req, res, next) => {
   try {
      await fn(req, res, next);
   } catch (error) {
      res.status(error.statusCode || 500).json({
         success: false,
         message: error.message,
      });
   }
};

export default asyncHandler;
