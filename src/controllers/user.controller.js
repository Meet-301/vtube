import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {
   uploadOnCloudinary,
   deleteFromCloudinary,
} from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const options = {
   httpOnly: true, //! hides the cookie from malicious client side scripts
   secure: true, //! ensures it is never sent in plaintext and can only be accessbile in https(not in http)
};

const generateAccessAndRefreshTokens = async (userId) => {
   try {
      const user = await User.findById(userId); //! find the user by given id
      const accessToken = user.generateAccessToken(); //! get access token
      const refreshToken = user.generateRefreshToken(); //! get refresh token

      user.refreshToken = refreshToken; //! setting refresh token in database field

      await user.save({ validateBeforeSave: false });

      return { accessToken, refreshToken };
   } catch (error) {
      throw new ApiError(
         500,
         "Something went wrong while generating access and refresh token"
      );
   }
};

const registerUser = asyncHandler(async (req, res) => {
   //! get user details from frontend
   const { fullName, email, username, password } = req.body;

   //! validation
   const isValidEmail = (email) => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
   };

   const isValidPassword = (password) => {
      const passwordRegex =
         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return passwordRegex.test(password);
   };

   if (
      [fullName, email, username, password].some(
         (field) => field?.trim() === ""
      )
   ) {
      throw new ApiError(400, "All fields are required");
   } else if (!isValidEmail(email)) {
      throw new ApiError(400, "Invalid email format");
   } else if (!isValidPassword(password)) {
      throw new ApiError(400, "Invalid password format");
   }

   //! check if user already exists(by username and email)
   //! findOne() method finds the first entry that matches the condition
   const existedUser = await User.findOne({
      $or: [{ username }, { email }],
   });

   if (existedUser) {
      throw new ApiError(409, "User already exists");
   }

   //! check for images and avatar
   const avatarLocalPath = req.files?.avatar?.[0]?.path;
   const coverImageLocalPath = req.files.coverImage?.[0].path;

   if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required");
   }

   //! upload them to cloudinary, avatar
   const avatar = await uploadOnCloudinary(avatarLocalPath);
   const coverImage = await uploadOnCloudinary(coverImageLocalPath);

   if (!avatar) {
      throw new ApiError(400, "Avatar file is required");
   }

   //! create user object - create entry in DB
   const user = await User.create({
      email,
      password,
      username: username.toLowerCase(),
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
   });

   //! remove password and refresh token fields from response
   //! select method selects all fields by default but for removal of any field,
   //! you need to follow below syntax
   const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
   );

   //! check for user creation
   if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering user");
   }

   //! return response
   return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
   //! request body -> data
   const { email, password } = req.body;

   //! check whether email is provided or not
   if (!email) {
      throw new ApiError(400, "Email is required");
   }

   //! find the user
   const user = await User.findOne({ email });

   //! if user not found
   if (!user) {
      throw new ApiError(404, "User not found");
   }

   //! check whether password is correct or not
   const isPasswordValid = await user.isPasswordCorrect(password);

   if (!isPasswordValid) {
      throw new ApiError(401, "Password is incorrect");
   }

   //! generate access and refresh tokens
   const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
   );

   const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
   );

   return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
         new ApiResponse(
            200,
            {
               user: loggedInUser,
               accessToken,
               refreshToken,
            },
            "User logged in successfully"
         )
      );
});

const logoutUser = asyncHandler(async (req, res, next) => {
   await User.findByIdAndUpdate(
      req.user._id,
      {
         refreshToken: undefined,
      },
      {
         returnDocument: "after", //! it'll return new updated document with updated values
      }
   );

   return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
   //! get refresh token from request's cookies
   const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

   //! if incoming refresh token is null or undefined
   if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized request");
   }

   try {
      //! verify token's signature and check if it's expired
      const decodedToken = jwt.verify(
         incomingRefreshToken,
         process.env.REFRESH_TOKEN_SECRET
      );

      //! find out user from decoded token
      const user = await User.findById(decodedToken?._id);

      //! if user doesn't exist in the DB
      if (!user) {
         throw new ApiError(401, "Invalid user");
      }

      //! if refresh token is invalid
      if (incomingRefreshToken !== user?.refreshToken) {
         throw new ApiError(401, "Invalid refresh token");
      }

      const { accessToken, refreshToken } =
         await generateAccessAndRefreshTokens(user._id);

      return res
         .status(200)
         .cookie("accessToken", accessToken, options)
         .cookie("refreshToken", refreshToken, options)
         .json(
            new ApiResponse(
               200,
               { accessToken, refreshToken },
               "Access token refreshed successfully"
            )
         );
   } catch (error) {
      throw new ApiError(400, error?.message || "Invalid refresh token");
   }
});

const updateAccountDetails = asyncHandler(async (req, res) => {
   //! extract data from request
   const { fullName, username } = req.body;

   //! match the current username for uniqueness purpose
   const currentUsername = await User.findOne({ username });

   if (currentUsername) {
      throw new ApiError(409, "User already exists with this username");
   }

   //! empty object for keeping data
   const updateFields = {};

   if (fullName) updateFields.fullName = fullName;
   else updateFields.username = username.toLowerCase();

   //! check whether both fields are empty or not
   if (Object.keys(updateFields).length === 0) {
      throw new ApiError(
         400,
         "At least one field is required for account updation"
      );
   }

   //! update the data
   const user = await User.findByIdAndUpdate(
      req.user._id,
      {
         $set: updateFields,
      },
      {
         returnDocument: "after",
      }
   ).select("-password -refreshToken");

   return res
      .status(200)
      .json(new ApiResponse(200, user, "Account updated successfully"));
});

const updateCurrentPassword = asyncHandler(async (req, res) => {
   const { oldPassword, newPassword } = req.body;

   const user = await User.findById(req.user?._id);

   const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

   if (!isPasswordCorrect) {
      throw new ApiError(400, "Incorrect old password");
   }

   user.password = newPassword;

   await user.save({ validateBeforeSave: false });

   return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
   return res
      .status(200)
      .json(
         new ApiResponse(200, req.user, "Current user fetched successfully")
      );
});

const updateAvatar = asyncHandler(async (req, res) => {
   //! getting fields access
   const avatarLocalPath = req.file?.path;
   const currentUser = req.user;

   //! check whether avatar file is provided or not
   if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required");
   }

   //! upload new avatar on cloudinary
   const avatar = await uploadOnCloudinary(avatarLocalPath);

   if (!avatar?.url) {
      throw new ApiError(400, "Error while uploading avatar on cloudinary");
   }

   //! update the avatar in DB
   await User.findByIdAndUpdate(
      currentUser?._id,
      {
         $set: { avatar: avatar.url },
      },
      {
         returnDocument: "after",
      }
   ).select("-password");

   //! remove old avatar from cloudinary
   const oldAvatarUrl = currentUser.avatar;

   await deleteFromCloudinary(oldAvatarUrl);

   return res
      .status(200)
      .json(new ApiResponse(200, avatar.url, "Avatar updated successfully"));
});

const updateCoverImage = asyncHandler(async (req, res) => {
   const coverImageLocalPath = req.file?.path;
   const currentUser = req.user;

   if (!coverImageLocalPath) {
      throw new ApiError(400, "Cover image file is required");
   }

   const coverImage = await uploadOnCloudinary(coverImageLocalPath);

   if (!coverImage?.url) {
      throw new ApiError(
         400,
         "Error while uploading cover image on cloudinary"
      );
   }

   await User.findByIdAndUpdate(
      currentUser?._id,
      {
         $set: { coverImage: coverImage.url },
      },
      {
         returnDocument: "after",
      }
   ).select("-password");

   const oldCoverImageUrl = currentUser?.coverImage;

   if (oldCoverImageUrl) {
      await deleteFromCloudinary(oldCoverImageUrl);
   }

   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            coverImage.url,
            "Cover image updated successfully"
         )
      );
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
   const { username } = req.params;

   if (!username?.trim()) {
      throw new ApiError(400, "Username is missing");
   }

   //! aggregate method returns array of documents as an output
   const channel = await User.aggregate([
      //! aggregate method used to define aggeregation pipelines
      {
         $match: {
            //! $match - same as WHERE clause in SQL
            username: username,
         },
      },
      {
         $lookup: {
            //! $lookup - join operation
            from: "subscriptions",
            localField: "_id",
            foreignField: "channel",
            as: "subscribers",
         },
      },
      {
         $lookup: {
            from: "subscriptions",
            localField: "_id",
            foreignField: "subscriber",
            as: "subscribedTo",
         },
      },
      {
         $addFields: {
            //! $ adds the new fields in DB
            subscribersCount: {
               $size: "$subscribers", //! $size: counts the size
            },
            subscribedToCount: {
               $size: "$subscribedTo",
            },
            isSubscribed: {
               $cond: {
                  //! $cond - used to define a condition(3 params - if, then, else)
                  if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                  //! $in - checks if first argument exists in second argument
                  then: true, //! if above condition match then add true in isSubscribed
                  else: false, //! else add false
               },
            },
         },
      },
      {
         $project: {
            email: 1,
            username: 1,
            fullName: 1,
            avatar: 1,
            coverImage: 1,
            subscribersCount: 1,
            subscribedToCount: 1,
            isSubscribed: 1,
         },
      },
   ]);

   if (!channel?.length) {
      throw new ApiError(404, "Channel not found");
   }

   return res
      .status(200)
      .json(
         new ApiResponse(200, channel[0], "User channel fetched successfully")
      );
});

//! getting watch history of current logged in user
const getWatchHistory = asyncHandler(async (req, res) => {
   const user = await User.aggregate([
      {
         $match: {
            _id: new mongoose.Types.ObjectId(req.user._id),
         },
      },
      {
         $project: {
            password: 0,
            refreshToken: 0
         }
      },
      {
         $lookup: {
            from: "videos",
            localField: "watchHistory",
            foreignField: "_id",
            as: "watchHistory",
            pipeline: [
               {
                  $lookup: {
                     from: "users",
                     localField: "owner",
                     foreignField: "_id",
                     as: "owner",
                     pipeline: [
                        {
                           $project: {
                              fullName: 1,
                              avatar: 1,
                              username: 1,
                           },
                        }
                     ],
                  },
               },
               {
                  $addFields: {
                     owner: {
                        $first: "$owner"
                     }
                  }
               }
            ],
         },
      },
   ]);

   return res
      .status(200)
      .json(
         new ApiResponse(200, user[0].watchHistory, "User's watch history fetched successfully")
      );
});

export {
   registerUser,
   loginUser,
   logoutUser,
   refreshAccessToken,
   updateCurrentPassword,
   getCurrentUser,
   updateAccountDetails,
   updateCoverImage,
   updateAvatar,
   getUserChannelProfile,
   getWatchHistory,
};
