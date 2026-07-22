import { Router } from "express";
import {
   registerUser,
   loginUser,
   logoutUser,
   refreshAccessToken,
   updateCurrentPassword,
   getCurrentUser,
   updateAccountDetails,
   updateAvatar,
   updateCoverImage,
   getUserChannelProfile,
   getWatchHistory,
} from "../controllers/user.controller.js";
import { multerUpload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(
   //! set the fields of multer to upload the files before registerUser gets invoked
   multerUpload.fields([
      {
         name: "avatar",
         maxCount: 1,
      },
      {
         name: "coverImage",
         maxCount: 1,
      },
   ]),
   registerUser
);

userRouter.route("/login").post(loginUser);

//! secure routes
userRouter.route("/logout").post(verifyJWT, logoutUser);
userRouter.route("/refresh-token").post(refreshAccessToken);
userRouter.route("/update-password").patch(verifyJWT, updateCurrentPassword);
userRouter.route("/current-user").get(verifyJWT, getCurrentUser);
userRouter.route("/update-account").patch(verifyJWT, updateAccountDetails);

userRouter
   .route("/update-avatar")
   .patch(verifyJWT, multerUpload.single("avatar"), updateAvatar);
userRouter
   .route("/update-cover")
   .patch(verifyJWT, multerUpload.single("coverImage"), updateCoverImage);

//! :username is used for query params
userRouter.route("/channel/:username").get(verifyJWT, getUserChannelProfile);
userRouter.route("/watch-history").get(verifyJWT, getWatchHistory);

export default userRouter;
