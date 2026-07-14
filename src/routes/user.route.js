import { Router } from "express";
import registerUser from "../controllers/user.controller.js";
import { multerUpload } from "../middlewares/multer.middleware.js";

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

export default userRouter;
