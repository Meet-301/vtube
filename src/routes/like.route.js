import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
   getLikedVideos,
   isLiked,
   toggleLikes,
} from "../controllers/like.controller.js";

const likeRouter = Router();

likeRouter.route("/toggle/:videoId").patch(verifyJWT, toggleLikes);

likeRouter.route("/all").get(verifyJWT, getLikedVideos);
likeRouter.route("/status/:videoId").get(verifyJWT, isLiked);

export default likeRouter;
