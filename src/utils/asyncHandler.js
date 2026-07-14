//! wrapper class to wrap the functions

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
      res.status(error.code || 500).json({
         success: false,
         message: error.message,
      });
   }
};

export default asyncHandler;
