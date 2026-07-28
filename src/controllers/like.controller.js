import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { Like } from "../models/like.model.js";

const toggleLikes = asyncHandler(async (req, res) => {
   const { videoId } = req.params;

   if (!videoId) {
      throw new ApiError(400, "Video id is required");
   }

   if (!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new ApiError(400, "Invalid video id");
   }

   const video = await Video.findById(videoId);

   if (!video) {
      throw new ApiError(404, "Video not found");
   }

   const existingLike = await Like.findOne({
      video: videoId,
      likedBy: req.user._id,
   });

   let videoRes, likeRes, isLiked;

   if (!existingLike) {
      likeRes = await Like.create({ video: videoId, likedBy: req.user._id });
      videoRes = await Video.findByIdAndUpdate(
         videoId,
         { $inc: { likes: 1 } },
         { returnDocument: "after" }
      );
      isLiked = true;
   } else {
      likeRes = await Like.deleteOne({ video: videoId, likedBy: req.user._id });
      videoRes = await Video.findByIdAndUpdate(
         videoId,
         { $inc: { likes: -1 } },
         { returnDocument: "after" }
      );
      isLiked = false;
   }

   const resObj = {
      videoResponse: videoRes,
      likeResponse: likeRes,
      isLiked: isLiked,
   };

   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            resObj,
            isLiked ? "Video liked successfully" : "Video unliked successfully"
         )
      );
});

export { toggleLikes }