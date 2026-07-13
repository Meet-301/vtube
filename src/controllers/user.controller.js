import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js"

const registerUser = asyncHandler(async(req, res) => {
    //! get user details from frontend
    //! validation
    //! check if user already exists: username, email
    //! check for images and avatar
    //! upload them to cloudinary, avatar
    //! create user object - create entry in DB
    //! remove password and refresh token fields from response
    //! check for user creation
    //! return response

    const {fullName, email, username, password} = req.body
    console.log(req.body)

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

})

export default registerUser