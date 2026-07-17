import { Router } from "express";
import {
   registerUser,
   loginUser,
   logoutUser,
   refreshAccessToken,
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

export default userRouter;
