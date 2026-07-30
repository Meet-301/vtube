import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { multerUpload } from "../middlewares/multer.middleware.js";
import {
   addVideoToPlaylist,
   createPlaylist,
   deletePlaylist,
   editPlaylist,
   getPlaylist,
   getUserPlaylists,
} from "../controllers/playlist.controller.js";

const playlistRouter = Router();

playlistRouter
   .route("/create")
   .post(verifyJWT, multerUpload.single("playlistCover"), createPlaylist);
playlistRouter
   .route("/:playlistId/add-video/:videoId")
   .post(verifyJWT, addVideoToPlaylist);

playlistRouter.route("/:playlistId").get(verifyJWT, getPlaylist);
playlistRouter.route("/user-playlists").get(verifyJWT, getUserPlaylists);

playlistRouter
   .route("/:playlistId")
   .patch(verifyJWT, multerUpload.single("playlistCover"), editPlaylist);

playlistRouter.route("/:playlistId").delete(verifyJWT, deletePlaylist);

export default playlistRouter;
