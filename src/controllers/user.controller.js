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
import crypto from "crypto";
import sendEmail from "../utils/mailer.js";

const accessOptions = {
   httpOnly: true, //! hides the cookie from malicious client side scripts
   secure: true, //! ensures it is never sent in plaintext and can only be accessbile in https(not in http)
   maxAge: 24 * 60 * 60 * 1000, //! cookie expiry time(1 day)
};

const refreshOptions = {
   httpOnly: true,
   secure: true,
   maxAge: 10 * (24 * 60 * 60 * 1000), //! (10 days)
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
   if (
      [fullName, email, username, password].some(
         (field) => field?.trim() === ""
      )
   ) {
      throw new ApiError(400, "All fields are required");
   }

   const isValidEmail = (email) => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
   };

   const isValidPassword = (password) => {
      const passwordRegex =
         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return passwordRegex.test(password);
   };

   if (!isValidEmail(email)) {
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
   const avatarLocalPath = req.files.avatar?.[0]?.path;
   const coverImageLocalPath = req.files.coverImage?.[0].path;

   if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required");
   }

   //! upload them to cloudinary, avatar
   const avatar = await uploadOnCloudinary(avatarLocalPath);
   const coverImage = await uploadOnCloudinary(coverImageLocalPath);

   if (!avatar) {
      throw new ApiError(
         400,
         "Something went wrong while uploading avatar on cloudinary"
      );
   }

   const emailVerificationToken = crypto.randomBytes(32).toString("hex");

   const emailVerificationExpiry = new Date(Date.now() + 15 * 60 * 1000);

   //! create user object - create entry in DB
   const user = await User.create({
      email: email.trim(),
      password: password.trim(),
      username: username.toLowerCase(),
      fullName: fullName.trim(),
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      isVerified: false,
      emailVerificationToken,
      emailVerificationExpiry,
   });

   //! select method selects all fields by default but for removal of any field,
   //! you need to follow below syntax(-fieldName)
   const createdUser = await User.findById(user._id).select(
      "-password -googleId -refreshToken -emailVerificationToken -emailVerificationExpiry -passwordResetToken -passwordResetExpiry"
   );

   try {
      await sendEmail({
         to: createdUser.email,
         subject: "Welcome to Vtube - Verify your email",
         html: `
            <h2>Welcome, ${createdUser.fullName}</h2>

            <p>Your verification code is:</p>

            <h1>${emailVerificationToken}</h1>

            <p>This code is valid for 15 minutes</p>
         `,
      });
   } catch (error) {
      console.error("Email sending failed: ", error);
   }

   //! check for user creation
   if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering user");
   }

   //! return response
   return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

const verifyEmail = asyncHandler(async (req, res) => {
   const { email, token } = req.body;

   if (!email || !token) {
      throw new ApiError(400, "Email and token are required");
   }

   const user = await User.findOne({ email });

   if (!user) {
      throw new ApiError(400, "User not found");
   }

   if (user.isVerified) {
      throw new ApiError(400, "Email is verified already");
   }

   if (user.emailVerificationToken !== token) {
      throw new ApiError(400, "Invalid verification token");
   }

   if (user.emailVerificationExpiry < new Date()) {
      throw new ApiError(400, "Verification token expired");
   }

   user.isVerified = true;

   user.emailVerificationToken = undefined;
   user.emailVerificationExpiry = undefined;

   await user.save({ validateBeforeSave: false });

   return res
      .status(200)
      .json(new ApiResponse(200, {}, "Email verified successfully"));
});

const resendVerificationEmail = asyncHandler(async (req, res) => {
   const { email } = req.body;

   if (!email) {
      throw new ApiError(400, "Email is required");
   }

   const isValidEmail = (email) => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
   };

   if (!isValidEmail(email)) {
      throw new ApiError(400, "Invalid email format");
   }

   const user = await User.findOne({ email });

   if (!user) {
      throw new ApiError(400, "User not found");
   }

   if (user.isVerified) {
      throw new ApiError(400, "Email is verified already");
   }

   const resendEmailToken = crypto.randomBytes(32).toString("hex");
   const resendEmailTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

   user.emailVerificationToken = resendEmailToken;
   user.emailVerificationExpiry = resendEmailTokenExpiry;

   await user.save({ validateBeforeSave: false });

   try {
      await sendEmail({
         to: user.email,
         subject: "Vtube - Verify your email again",
         html: `
            <h2>Hi, ${user.fullName}</h2>

            <p>Your verification code is:</p>

            <h1>${resendEmailToken}</h1>

            <p>This code is valid for 15 minutes</p>
         `,
      });
   } catch (error) {
      console.error("Email sending failed: ", error);
   }

   return res
      .status(200)
      .json(
         new ApiResponse(200, {}, "Verification email re-sent successfully")
      );
});

const forgotPassword = asyncHandler(async (req, res) => {
   const { email } = req.body;

   if (!email) {
      throw new ApiError(400, "Email is required");
   }

   const user = await User.findOne({ email });

   if (!user) {
      throw new ApiError(400, "User not found");
   }

   const forgotPasswordToken = crypto.randomBytes(32).toString("hex");
   const forgotPasswordTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

   user.passwordResetToken = forgotPasswordToken;
   user.passwordResetExpiry = forgotPasswordTokenExpiry;

   await user.save({ validateBeforeSave: false });

   try {
      await sendEmail({
         to: email,
         subject: "Vtube - Reset password link",
         html: `
         <h2>Hi, ${user.fullName}</h2>

         <p>Your code for password reset is:</p>

         <h1>${forgotPasswordToken}</h1>
         `,
      });
   } catch (error) {
      console.error(`Error while processing forgot password: ${error}`);
   }

   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            {},
            "Email sent successfully for resetting the password"
         )
      );
});

const resetPassword = asyncHandler(async (req, res) => {
   const { token, newPassword } = req.body;

   if (!token || !newPassword) {
      throw new ApiError(400, "Token and new password both are required");
   }

   const isValidPassword = (password) => {
      const passwordRegex =
         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return passwordRegex.test(password);
   };

   if (!isValidPassword(newPassword)) {
      throw new ApiError(400, "Invalid password format");
   }

   const user = await User.findOne({ passwordResetToken: token });

   if (!user) {
      throw new ApiError(400, "Invalid password reset token");
   }

   if (user.passwordResetExpiry < new Date()) {
      throw new ApiError(400, "Password reset token is expired");
   }

   user.password = newPassword;

   user.passwordResetToken = undefined;
   user.passwordResetExpiry = undefined;
   user.accessToken = undefined;
   user.refreshToken = undefined;

   await user.save();

   return res
      .status(200)
      .clearCookie("accessToken", accessOptions)
      .clearCookie("refreshToken", refreshOptions)
      .json(new ApiResponse(200, {}, "Password reset successfully"));
});

const googleLogin = asyncHandler(async (req, res) => {
   const profile = req.user;

   const fullName = profile.displayName;
   const email = profile.emails[0].value;
   const avatar = profile.photos[0].value;
   const googleId = profile.id;
   const username = email.split("@")[0];

   const existingUser = await User.findOne({ email });

   if (existingUser) {
      const { accessToken, refreshToken } =
         await generateAccessAndRefreshTokens(req.user._id);

      return res
         .status(200)
         .cookie("accessToken", accessToken, accessOptions)
         .cookie("refreshToken", refreshToken, refreshOptions)
         .json(
            new ApiResponse(
               200,
               {
                  user: existingUser,
                  accessToken,
                  refreshToken,
               },
               "Google login successful"
            )
         );
   } else {
      const user = await User.create({
         fullName,
         email,
         avatar,
         googleId,
         username,
         isVerified: true,
      });

      const { accessToken, refreshToken } =
         await generateAccessAndRefreshTokens(user._id);

      return res
         .status(200)
         .cookie("accessToken", accessToken, accessOptions)
         .cookie("refreshToken", refreshToken, refreshOptions)
         .json(
            new ApiResponse(
               200,
               {
                  user,
                  accessToken,
                  refreshToken,
               },
               "Google login successful"
            )
         );
   }
});

const loginUser = asyncHandler(async (req, res) => {
   //! request body -> data
   const { email, password } = req.body;

   //! check whether email, password is provided or not
   if (!email || !password) {
      throw new ApiError(400, "Both email and password are required");
   }

   //! find the user
   const user = await User.findOne({ email });

   //! if user not found
   if (!user) {
      throw new ApiError(404, "User not found");
   }

   if (!user.password) {
      throw new ApiError(
         400,
         "This account is created with google. Please login with google or set a password using forgot password"
      );
   }

   //! check whether password is correct or not
   const isPasswordValid = await user.isPasswordCorrect(password);

   if (!isPasswordValid) {
      throw new ApiError(401, "Password is incorrect");
   }

   if (!user.isVerified) {
      throw new ApiError(403, "Please verify your email before login");
   }

   //! generate access and refresh tokens
   const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
   );

   const loggedInUser = await User.findById(user._id).select(
      "-password -googleId -refreshToken -emailVerificationToken -emailVerificationExpiry -passwordResetToken -passwordVerificationExpiry"
   );

   return res
      .status(200)
      .cookie("accessToken", accessToken, accessOptions)
      .cookie("refreshToken", refreshToken, refreshOptions)
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
   const user = await User.findByIdAndUpdate(
      req.user._id,
      {
         $unset: {
            refreshToken: 1,
         },
      },
      {
         returnDocument: "after", //! it'll return new updated document with updated values
      }
   );

   console.log(user);

   return res
      .status(200)
      .clearCookie("accessToken", accessOptions)
      .clearCookie("refreshToken", refreshOptions)
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
         .cookie("accessToken", accessToken, accessOptions)
         .cookie("refreshToken", refreshToken, refreshOptions)
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
   if (username) {
      const currentUsername = await User.findOne({ username });

      if (currentUsername) {
         throw new ApiError(409, "User already exists with this username");
      }
   }

   //! empty object for keeping data
   const updateFields = {};

   if (fullName) {
      updateFields.fullName = fullName;
   }
   if (username) {
      updateFields.username = username;
   }
   if (fullName && username) {
      updateFields.fullName = fullName;
      updateFields.username = username;
   }

   //! check whether both fields are empty or not
   if (Object.keys(updateFields).length === 0) {
      throw new ApiError(400, "Please enter all data");
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
   ).select(
      "-password -googleId -refreshToken -emailVerificationToken -emailVerificationExpiry -passwordResetToken -passwordResetExpiry"
   );

   return res
      .status(200)
      .json(new ApiResponse(200, user, "Account updated successfully"));
});

const updateCurrentPassword = asyncHandler(async (req, res) => {
   const { oldPassword, newPassword } = req.body;

   if (!oldPassword || !newPassword) {
      throw new ApiError(400, "Both old and new password are required");
   }

   const user = await User.findById(req.user?._id);

   const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

   if (!isPasswordCorrect) {
      throw new ApiError(400, "Incorrect old password");
   }

   user.password = newPassword;
   user.accessToken = undefined;
   user.refreshToken = undefined;

   await user.save({ validateBeforeSave: false });

   return res
      .status(200)
      .clearCookie("accessToken", accessOptions)
      .clearCookie("refreshToken", refreshOptions)
      .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
   const currentUser = await User.findById(req.user._id).select(
      "-password -googleId -refreshToken -emailVerificationToken -emailVerificationExpiry -passwordResetToken -passwordResetExpiry"
   );

   return res
      .status(200)
      .json(
         new ApiResponse(200, currentUser, "Current user fetched successfully")
      );
});

const updateAvatar = asyncHandler(async (req, res) => {
   //! getting fields access
   const avatarLocalPath = req.file?.path;
   const currentUser = req.user;

   //! check whether avatar file is provided or not
   if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required while updation");
   }

   //! upload new avatar on cloudinary
   const newAvatar = await uploadOnCloudinary(avatarLocalPath);

   if (!newAvatar?.url) {
      throw new ApiError(400, "Error while uploading avatar on cloudinary");
   }

   //! update the avatar in DB
   await User.findByIdAndUpdate(
      currentUser?._id,
      {
         $set: { avatar: newAvatar.url },
      },
      {
         returnDocument: "after",
      }
   );

   //! remove old avatar from cloudinary
   const oldAvatarUrl = currentUser.avatar;

   await deleteFromCloudinary(oldAvatarUrl);

   return res
      .status(200)
      .json(new ApiResponse(200, newAvatar.url, "Avatar updated successfully"));
});

const updateCoverImage = asyncHandler(async (req, res) => {
   const coverImageLocalPath = req.file?.path;
   const currentUser = req.user;

   if (!coverImageLocalPath) {
      throw new ApiError(400, "Cover image file is required");
   }

   const newCoverImage = await uploadOnCloudinary(coverImageLocalPath);

   if (!newCoverImage?.url) {
      throw new ApiError(
         400,
         "Error while uploading cover image on cloudinary"
      );
   }

   await User.findByIdAndUpdate(
      currentUser?._id,
      {
         $set: { coverImage: newCoverImage.url },
      },
      {
         returnDocument: "after",
      }
   );

   const oldCoverImageUrl = currentUser?.coverImage;

   if (oldCoverImageUrl) {
      await deleteFromCloudinary(oldCoverImageUrl);
   }

   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            newCoverImage.url,
            "Cover image updated successfully"
         )
      );
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
   const { username } = req.params;

   const currentUser = await User.findOne({ username });

   if (!currentUser) {
      throw new ApiError(404, "User not found");
   }

   //! aggregate method returns array of documents as an output
   const channel = await User.aggregate([
      //! aggregate method used to define aggeregation pipelines
      {
         $match: {
            //! $match - same as WHERE clause in SQL
            //! match the username
            username: username,
         },
      },
      {
         //! $lookup - left outer join operation(its output will be in array format)
         $lookup: {
            from: "subscriptions", //! right side collection - subscriptions
            localField: "_id", //! connect from user collection's _id field
            foreignField: "channel", //! connect to subscriptions collection's channel field
            as: "subscribers", //! output will be provided here as subscribers field
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
   const videos = await User.aggregate([
      {
         $match: {
            _id: new mongoose.Types.ObjectId(req.user._id),
         },
      },
      {
         $lookup: {
            from: "videos",
            localField: "watchHistory",
            foreignField: "_id",
            as: "watchHistory",
            let: {
               originalOrder: "$watchHistory",
            },
            pipeline: [
               {
                  $match: {
                     isPublished: true,
                  },
               },
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
                        },
                     ],
                  },
               },
               {
                  $addFields: {
                     owner: {
                        $first: "$owner",
                     },
                     sortOrder: {
                        $indexOfArray: ["$$originalOrder", "$_id"],
                     },
                  },
               },
               {
                  $sort: {
                     sortOrder: 1,
                  },
               },
               {
                  $project: {
                     thumbnail: 1,
                     duration: 1,
                     views: 1,
                     owner: 1,
                     title: 1,
                  },
               },
            ],
         },
      },
   ]);

   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            videos[0].watchHistory,
            "User's watch history fetched successfully"
         )
      );
});

const removeFromWatchHistory = asyncHandler(async (req, res) => {
   const { videoId } = req.query;

   if (!videoId) {
      throw new ApiError(400, "Video id is required");
   }

   if (!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new ApiError(400, "Invalid video id");
   }

   const updatedWatchHistory = await User.findByIdAndUpdate(
      req.user._id,
      {
         $pull: {
            watchHistory: videoId,
         },
      },
      {
         returnDocument: "after",
      }
   );

   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            updatedWatchHistory.watchHistory,
            "Video removed successfully from watch history"
         )
      );
});

export {
   registerUser,
   verifyEmail,
   resendVerificationEmail,
   forgotPassword,
   resetPassword,
   googleLogin,
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
   removeFromWatchHistory,
};
