import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { VideoNote } from "../models/videoNote.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";

const addNote = asyncHandler(async (req, res) => {
   const owner = req.user._id;
   const { videoId } = req.params;
   let { title, description, timestamp } = req.body;

   if (!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new ApiError(400, "Invalid video id");
   }

   const video = await Video.findById(videoId)

   if(!video) {
      throw new ApiError(400, "Video not found")
   }

   if (!timestamp) {
      throw new ApiError(400, "Timestamp is required");
   }
   timestamp = Number(timestamp);

   if(timestamp <= 0 || timestamp >= video.duration) {
      throw new ApiError(400, "Invalid timestamp")
   }

   if (!title || !description) {
      throw new ApiError(400, "Title and Description both are required");
   }

   const videoNote = await VideoNote.create({
      owner,
      videoId,
      timestamp,
      title,
      description,
   });

   return res
      .status(201)
      .json(new ApiResponse(200, videoNote, "Video note added successfully"));
});

const getNotes = asyncHandler(async (req, res) => {
   const { videoId } = req.params;

   if (!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new ApiError(400, "Invalid video id");
   }

   const notes = await VideoNote.find({
      videoId,
      owner: req.user._id,
   }).select("-owner -videoId");

   return res
      .status(200)
      .json(new ApiResponse(200, notes, "Video notes fetched successfully"));
});

const editNote = asyncHandler(async (req, res) => {
   const { noteId } = req.params;
   const { title, description } = req.body;

   if (!mongoose.Types.ObjectId.isValid(noteId)) {
      throw new ApiError(400, "Invalid note id");
   }

   const note = await VideoNote.findById(noteId);

   if (!note) {
      throw new ApiError(404, "Note not found");
   }

   if (note.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You are not authorized to edit this note");
   }

   let updateFields = {};

   if (title) updateFields.title = title;
   if (description) updateFields.description = description;

   if (Object.keys(updateFields).length === 0) {
      throw new ApiError(
         400,
         "Please enter at least one field to edit the note"
      );
   }

   const editedNote = await VideoNote.findByIdAndUpdate(
      noteId,
      {
         $set: updateFields,
      },
      { returnDocument: "after" }
   );

   return res
      .status(200)
      .json(new ApiResponse(200, editedNote, "Note edited successfully"));
});

const deleteNote = asyncHandler(async (req, res) => {
   const { noteId } = req.params;

   if (!mongoose.Types.ObjectId.isValid(noteId)) {
      throw new ApiError(400, "Invalid note id");
   }

   const note = await VideoNote.findById(noteId);

   if (!note) {
      throw new ApiError(404, "Note not found");
   }

   if (note.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You are not authorized to delete this note");
   }

   await VideoNote.findByIdAndDelete(noteId);

   return res
      .status(200)
      .json(new ApiResponse(200, {}, "Note deleted successfully"));
});

export {
    addNote,
    getNotes,
    editNote,
    deleteNote
}
