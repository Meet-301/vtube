import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { Comment } from "../models/comment.model.js";
import ApiResponse from "../utils/ApiResponse.js";

const addComment = asyncHandler(async (req, res) => {
   if(!req?.body) {
      throw new ApiError(400, "Request data is missing")
   }
 
   const { videoId } = req.params;
   const { content } = req.body;

   if (!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new ApiError(400, "Invalid video id");
   }

   if (content === "") {
      throw new ApiError(400, "Content is required");
   }

   const comment = await Comment.create({
      content,
      video: videoId,
      owner: req.user._id,
   });

   return res
      .status(201)
      .json(new ApiResponse(200, comment, "Comment added successfully"));
});

const getAllComments = asyncHandler(async (req, res) => {
   const { videoId } = req.params;

   if (!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new ApiError(400, "Invalid video id");
   }

   const comments = await Comment.aggregate([
      {
         $match: {
            video: new mongoose.Types.ObjectId(videoId),
         },
      },
      {
         $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
            pipeline: [
               {
                  $project: {
                     username: 1,
                     avatar: 1,
                  },
               },
            ],
         },
      },
      {
         $addFields: {
            owner: { $first: "$owner" },
         },
      },
      {
         $sort: {
            createdAt: -1,
         },
      },
   ]);

   return res
      .status(200)
      .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

const editComment = asyncHandler(async (req, res) => {
   const { commentId } = req.params;

   if (!mongoose.Types.ObjectId.isValid(commentId)) {
      throw new ApiError(400, "Invalid comment id");
   }

   const comment = await Comment.findById(commentId);

   if (!comment) {
      throw new ApiError(404, "Comment not found");
   }

   if (req.user._id.toString() !== comment.owner.toString()) {
      throw new ApiError(403, "You are not authorized to edit this comment");
   }

   if (!req?.body) {
      throw new ApiError(400, "Content is required");
   }

   const { content } = req.body;

   const editedComment = await Comment.findByIdAndUpdate(
      commentId,
      {
         $set: { content: content },
      },
      {
         returnDocument: "after",
      }
   );

   return res
      .status(200)
      .json(new ApiResponse(200, editedComment, "Comment edited successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
   const { commentId } = req.params;

   if (!mongoose.Types.ObjectId.isValid(commentId)) {
      throw new ApiError(400, "Invalid comment id");
   }

   const comment = await Comment.findById(commentId);

   if (!comment) {
      throw new ApiError(404, "Comment not found");
   }

   if (req.user._id.toString() !== comment.owner.toString()) {
      throw new ApiError(403, "You are not authorized to delete this comment");
   }

   await Comment.findByIdAndDelete(commentId);

   return res
      .status(200)
      .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

export { addComment, getAllComments, editComment, deleteComment };
