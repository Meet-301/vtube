import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

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
   const avatarLocalPath = req.files?.avatar[0]?.path;
   const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

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

export default registerUser;
