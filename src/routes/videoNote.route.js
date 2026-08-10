import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
   addNote,
   deleteNote,
   editNote,
   getNotes,
} from "../controllers/videoNote.controller.js";

const videoNoteRouter = Router();

videoNoteRouter.route("/:videoId").post(verifyJWT, addNote);

videoNoteRouter.route("/:videoId").get(verifyJWT, getNotes);

videoNoteRouter.route("/:noteId").patch(verifyJWT, editNote);

videoNoteRouter.route("/:noteId").delete(verifyJWT, deleteNote);

export default videoNoteRouter;
