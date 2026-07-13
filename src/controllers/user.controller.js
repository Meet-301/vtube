import asyncHandler from "../utils/asyncHandler.js";

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

    console.log(res.body)

})

export default registerUser