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
   removeFromWatchHistory,
   verifyEmail,
   resendVerificationEmail,
   forgotPassword,
   resetPassword,
   googleLogin,
} from "../controllers/user.controller.js";
import { multerUpload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import passport from "passport";

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
userRouter.route("/verify-email").post(verifyEmail);
userRouter.route("/resend-email").post(resendVerificationEmail);
userRouter.route("/forgot-password").post(forgotPassword);
userRouter.route("/logout").post(verifyJWT, logoutUser);
userRouter.route("/refresh-token").post(refreshAccessToken);

userRouter.route("/reset-password").patch(resetPassword);
userRouter.route("/update-password").patch(verifyJWT, updateCurrentPassword);
userRouter.route("/update-account").patch(verifyJWT, updateAccountDetails);
userRouter
   .route("/update-avatar")
   .patch(verifyJWT, multerUpload.single("avatar"), updateAvatar);
userRouter
   .route("/update-cover")
   .patch(verifyJWT, multerUpload.single("coverImage"), updateCoverImage);

//! :username is used for params(dynamic binbding)
userRouter.route("/current-user").get(verifyJWT, getCurrentUser);
userRouter.route("/channel/:username").get(verifyJWT, getUserChannelProfile);
userRouter.route("/watch-history").get(verifyJWT, getWatchHistory);
userRouter.route("/auth/google").get(
   passport.authenticate("google", {
      scope: ["profile", "email"]
   })
)
userRouter.route("/auth/google/callback").get(
   passport.authenticate("google", {
      session: false
   }),
   googleLogin
)

userRouter
   .route("/watch-history/remove")
   .delete(verifyJWT, removeFromWatchHistory);

export default userRouter;
