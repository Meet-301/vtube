import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
   addComment,
   deleteComment,
   editComment,
   getAllComments,
} from "../controllers/comment.controller.js";

const commentRouter = Router();

commentRouter.route("/add/:videoId").post(verifyJWT, addComment);

commentRouter.route("/all/:videoId").get(verifyJWT, getAllComments);

commentRouter.route("/:commentId").patch(verifyJWT, editComment);

commentRouter.route("/:commentId").delete(verifyJWT, deleteComment);

export default commentRouter;
