import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getLikedVideos, toggleLikes } from "../controllers/like.controller.js";

const likeRouter = Router();

likeRouter.route("/toggle/:videoId").patch(verifyJWT, toggleLikes);
likeRouter.route("/all").get(verifyJWT, getLikedVideos)

export default likeRouter;
