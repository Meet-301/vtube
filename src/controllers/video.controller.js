import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import getVideoDurationInSeconds from "get-video-duration";
import { Video } from "../models/video.model.js";
import fs from "fs";
import ApiResponse from "../utils/ApiResponse";

const uploadVideo = asyncHandler(async (req, res) => {
   if (!req?.body) {
      throw new ApiError(400, "Data is missing");
   }

   const MAX_DURATION_SECONDS = 30 * 60;

   const { title, description } = req.body;

   if (!title?.trim()) {
      throw new ApiError(400, "Title is required");
   }

   const videoFileLocalPath = req.files?.video?.[0]?.path;
   const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

   const videoDuration = await getVideoDurationInSeconds(videoFileLocalPath);

   if (!videoFileLocalPath || !thumbnailLocalPath) {
      throw new ApiError(400, "Video file or thumbnail is missing");
   }

   if (videoDuration > MAX_DURATION_SECONDS) {
      fs.unlinkSync(videoFileLocalPath);
      throw new ApiError(400, "Video duration exceeds the limit of 30 minutes");
   }

   const videoFile = await uploadOnCloudinary(videoFileLocalPath);
   const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

   const userId = req.user._id;

   const createdVideo = await Video.create({
      videoFile,
      title,
      description : description ?? "",
      thumbnail,
      duration: videoDuration,
      owner: userId,
   });

   return res
      .status(201)
      .json(new ApiResponse(200, createdVideo, "Video uploaded successfully"));
});

const watchVideo = asyncHandler(async (req, res) => {
   const { videoId } = req.params;

   if (!videoId) {
      throw new ApiError(400, "Video id is required");
   }

   const video = await Video.findById(videoId);

   if (!video) {
      throw new ApiError(404, "Video not found");
   }

   if(!video.isPublished) {
      throw new ApiError(403, "Video isn't published yet")
   }

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
      .json(new ApiResponse(200, updatedVideo, "Video watched successfully"));
});

const updateVideoDetails = asyncHandler(async (req, res) => {
   let { title, description, isPublished } = req.body
   const videoId = req.params

   if(!videoId) {
      throw new ApiError(400, "Video ID is required")
   }

   title = title?.trim()
   description = description?.trim()

   const updateFields = {};

   if(title) updateFields.title = title
   if(description) updateFields.description = description
   if(isPublished !== undefined) updateFields.isPublished = isPublished

   if(Object.keys(updateFields).length === 0) {
      throw new ApiError(400, "At least one field is required to update the video")
   }

   const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      {
         $set: updateFields
      },
      {
         returnDocument: "after"
      }
   )
})
