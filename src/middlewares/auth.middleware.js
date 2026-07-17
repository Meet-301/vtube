import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
   //! this trycatch block is required because errors occurred by verify() method are not covered by ApiError
   try {
      //! get the token from either cookies or request headers(authorization header)
      const token =
         req.cookies?.accessToken ||
         req.header("Authorization")?.replace("Bearer ", "");

      //! if token is null or undefined
      if (!token) {
         throw new ApiError(401, "Unauthorized request");
      }

      //! verify token's signature and check if it's expired
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const user = await User.findById(decodedToken._id).select(
         "-password -refreshToken"
      );

      if (!user) {
         throw new ApiError(401, "Invalid access token");
      }

      //! because downstream flow(e.g. middlewares, controllers) can use this authenticated user directly
      req.user = user;

      next();
   } catch (error) {
      throw new ApiError(401, error?.message || "Invalid access token");
   }
});

export { verifyJWT };
