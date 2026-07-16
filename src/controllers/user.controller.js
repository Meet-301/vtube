import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

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

   const loggedInUser = User.findById(user._id).select(
      "-password -refreshToken"
   );

   const options = {
      httpOnly: true,
      secure: true,
   };

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

   const options = {
      httpOnly: true, //! hides the cookie from malicious client side scripts
      secure: true, //! ensures it is never sent in plaintext and can only be accessbile in https(not in http) 
   };

   return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export { registerUser, loginUser, logoutUser };
