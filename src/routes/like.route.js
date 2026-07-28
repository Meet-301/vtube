import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleLikes } from "../controllers/like.controller.js";

const likeRouter = Router();

likeRouter.route("/toggle/:videoId").patch(verifyJWT, toggleLikes);

export default likeRouter;
