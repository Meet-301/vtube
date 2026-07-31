import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
   deleteFromCloudinary,
   uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { getVideoDurationInSeconds } from "get-video-duration";
import { Video } from "../models/video.model.js";
import fs from "fs";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { Like } from "../models/like.model.js";

const createVideo = asyncHandler(async (req, res) => {
   if (!req.body) {
      throw new ApiError(400, "Data is missing");
   }

   const MAX_DURATION_SECONDS = 30 * 60;

   const { title, description } = req.body;

   if (!title?.trim()) {
      throw new ApiError(400, "Title is required");
   }

   const videoFileLocalPath = req.files?.video?.[0]?.path;
   const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

   if (!videoFileLocalPath || !thumbnailLocalPath) {
      throw new ApiError(400, "Video file or thumbnail is missing");
   }

   const videoDuration = await getVideoDurationInSeconds(videoFileLocalPath);

   if (videoDuration > MAX_DURATION_SECONDS) {
      fs.unlinkSync(videoFileLocalPath);
      throw new ApiError(400, "Video duration exceeds the limit of 30 minutes");
   }

   const videoFile = await uploadOnCloudinary(videoFileLocalPath);
   const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

   if (!videoFile) {
      await deleteFromCloudinary(videoFile.url, "video");
      fs.unlinkSync(videoFileLocalPath);
      fs.unlinkSync(thumbnailLocalPath);
      throw new ApiError(500, "Video upload failure on cloudinary");
   }

   if (!thumbnail) {
      await deleteFromCloudinary(thumbnail.url);
      fs.unlinkSync(videoFileLocalPath);
      fs.unlinkSync(thumbnailLocalPath);
      throw new ApiError(500, "Thumbnail upload failure on cloudinary");
   }

   const userId = req.user._id;

   const createdVideo = await Video.create({
      videoFile: videoFile.url,
      title: title.trim(),
      description: description?.trim() ?? "",
      thumbnail: thumbnail.url,
      duration: videoDuration,
      owner: userId,
   });

   return res
      .status(201)
      .json(new ApiResponse(200, createdVideo, "Video created successfully"));
});

const watchVideo = asyncHandler(async (req, res) => {
   const { videoId } = req.params;

   if (!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new ApiError(400, "Invalid video id");
   }

   const video = await Video.findById(videoId);

   if (!video) {
      throw new ApiError(404, "Video not found");
   }

   if (!video.isPublished) {
      throw new ApiError(403, "Video isn't published yet");
   }

   //! remove that specific video from watch history(to avoid duplication)
   await User.findByIdAndUpdate(req.user._id, {
      $pull: {
         watchHistory: videoId,
      },
   });

   //! add that video again at top(with the help of $each and $position: 0)
   await User.findByIdAndUpdate(req.user._id, {
      $push: {
         watchHistory: {
            $each: [videoId],
            $position: 0,
         },
      },
   });

   const currentUserId = String(req.user._id);
   const videoOwnerId = String(video.owner);

   //! increment the views with the help of $inc
   if (currentUserId !== videoOwnerId) {
      const updatedVideo = await Video.findByIdAndUpdate(
         videoId,
         {
            $inc: { views: 1 },
         },
         {
            returnDocument: "after",
         }
      );

      return res
         .status(200)
         .json(
            new ApiResponse(200, updatedVideo, "Video watched successfully")
         );
   } else {
      return res
         .status(200)
         .json(new ApiResponse(200, {}, "Video watched successfully"));
   }
});

const getAllVideos = asyncHandler(async (req, res) => {
   const { page = 1, limit = 10 } = req.query;

   const pageNumber = Number(page);
   const limitNumber = Number(limit);

   const skip = (pageNumber - 1) * limitNumber;

   const videos = await Video.find({ isPublished: true })
      .skip(skip)
      .limit(limitNumber);

   return res
      .status(200)
      .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
   const { videoId } = req.params

   if(!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new ApiError(400, "Invalid video id")
   }

   const videoDetails = await Video.aggregate([
      {
         $match: {
            _id: new mongoose.Types.ObjectId(videoId)
         }
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
                     fullName: 1,
                     avatar: 1
                  }
               },
            ]
         }
      },
      {
         $addFields: {
            owner: {
               $first: "$owner"
            },
         }
      },
      {
         $lookup: {
            from: "subscriptions",
            localField: "owner._id",
            foreignField: "channel",
            as: "subscribers"
         }
      },
      {
         $addFields: {
            subscribersCount: {
               $size: "$subscribers"
            },
            isSubscribed: {
               $cond: {
                  if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                  then: true,
                  else: false
               }
            }
         }
      },
      {
         $project: {
            subscribers: 0
         }
      }
   ])

   if(!videoDetails.length) {
      throw new ApiError(404, "Video not found")
   }

   return res
   .status(200)
   .json(new ApiResponse(200, videoDetails, "Video fetched successfully"))
})

const getVideosByUsername = asyncHandler(async (req, res) => {
   const { username } = req.params;

   const user = await User.findOne({ username: username });

   if (!user) {
      throw new ApiError(404, "User not found");
   }

   if (user._id.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You are not authorized to fetch the videos");
   }

   const { page = 1, limit = 10 } = req.query;

   const pageNumber = Number(page);
   const limitNumber = Number(limit);

   const skip = (pageNumber - 1) * limitNumber;

   const videos = await Video.find({ owner: user._id })
      .skip(skip)
      .limit(limitNumber);

   return res
      .status(200)
      .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const updateVideoDetails = asyncHandler(async (req, res) => {
   if (!req.body) {
      throw new ApiError(400, "Request body is empty");
   }

   const { title, description, isPublished } = req.body;
   const { videoId } = req.params;

   if (!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new ApiError(410, "Invalid video id");
   }

   const video = await Video.findById(videoId);

   const videoOwner = String(video.owner);
   const currentUserId = String(req.user._id);

   if (videoOwner !== currentUserId) {
      throw new ApiError(403, "You are not authorized to update the video");
   }

   const updateFields = {};

   if (title) updateFields.title = title.trim();
   if (description) updateFields.description = description.trim();
   if (isPublished !== undefined) updateFields.isPublished = isPublished;

   if (Object.keys(updateFields).length === 0) {
      throw new ApiError(
         400,
         "At least one field is required to update the video"
      );
   }

   const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      {
         $set: updateFields,
      },
      {
         returnDocument: "after",
      }
   );

   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            updatedVideo,
            "Video details updated successfully"
         )
      );
});

const updateThumbnail = asyncHandler(async (req, res) => {
   const thumbnailLocalPath = req.file?.path;
   const { videoId } = req.params;

   if (!thumbnailLocalPath) {
      throw new ApiError(400, "Thumbnail is required");
   }

   if (!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new ApiError(410, "Invalid video id");
   }

   const oldVideo = await Video.findById(videoId);

   const videoOwner = String(oldVideo.owner);
   const currentUserId = String(req.user._id);

   if (videoOwner !== currentUserId) {
      throw new ApiError(403, "You are not authorized to update the video");
   }

   await deleteFromCloudinary(oldVideo?.thumbnail);

   const newThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

   if (!newThumbnail) {
      throw new ApiError(500, "Cloudinary upload operation failed");
   }

   const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      {
         $set: {
            thumbnail: newThumbnail.url,
         },
      },
      {
         returnDocument: "after",
      }
   );

   return res
      .status(200)
      .json(
         new ApiResponse(200, updatedVideo, "Thumbnail updated successfully")
      );
});

const deleteVideoById = asyncHandler(async (req, res) => {
   const { videoId } = req.params;

   if (!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new ApiError(410, "Invalid video id");
   }

   const video = await Video.findById(videoId);

   if (!video) {
      throw new ApiError(404, "Video not found");
   }

   const videoOwner = String(video.owner);
   const currentUserId = String(req.user._id);

   if (videoOwner !== currentUserId) {
      throw new ApiError(403, "You are not authorized to delete the video");
   }

   await deleteFromCloudinary(video.videoFile, "video");
   await deleteFromCloudinary(video.thumbnail);

   await Video.deleteOne({
      _id: new mongoose.Types.ObjectId(videoId),
   });

   return res
      .status(200)
      .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

const deleteVideosByUsername = asyncHandler(async (req, res) => {
   const { username } = req.params;

   const user = await User.findOne({
      username: username,
   });

   if (!user) {
      throw new ApiError(404, "Username not found");
   }

   const videos = await Video.find({ owner: user._id });

   for (const video of videos) {
      await deleteFromCloudinary(video.videoFile, "video");
      await deleteFromCloudinary(video.thumbnail);
   }

   await Video.deleteMany({
      owner: user._id,
   });

   return res
      .status(200)
      .json(new ApiResponse(200, {}, "All videos deleted successfully"));
});

export {
   createVideo,
   getAllVideos,
   getVideoById,
   getVideosByUsername,
   watchVideo,
   updateVideoDetails,
   updateThumbnail,
   deleteVideoById,
   deleteVideosByUsername,
};
