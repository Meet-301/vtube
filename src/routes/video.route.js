import { Router } from "express";
import { multerUpload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
   createVideo,
   deleteVideoById,
   deleteVideosByUsername,
   getAllVideos,
   getVideoById,
   getVideosByUsername,
   updateThumbnail,
   updateVideoDetails,
   watchVideo,
} from "../controllers/video.controller.js";

const videoRouter = Router();

videoRouter.route("/create").post(
   verifyJWT,
   multerUpload.fields([
      {
         name: "video",
         maxCount: 1,
      },
      {
         name: "thumbnail",
         maxCount: 1,
      },
   ]),
   createVideo
);

videoRouter.route("/watch/:videoId").get(verifyJWT, watchVideo);
videoRouter.route("/all").get(verifyJWT, getAllVideos);
videoRouter.route("/username/:username").get(verifyJWT, getVideosByUsername);
videoRouter.route("/id/:videoId").get(verifyJWT, getVideoById);

videoRouter
   .route("/update-details/:videoId")
   .patch(verifyJWT, updateVideoDetails);
videoRouter
   .route("/update-thumbnail/:videoId")
   .patch(verifyJWT, multerUpload.single("thumbnail"), updateThumbnail);

videoRouter.route("/videoid/:videoId").delete(verifyJWT, deleteVideoById);
videoRouter
   .route("/username/:username")
   .delete(verifyJWT, deleteVideosByUsername);

export default videoRouter;
