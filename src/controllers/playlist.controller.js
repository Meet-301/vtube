import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
   deleteFromCloudinary,
   uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
   if (!req.body) {
      throw new ApiError(400, "Request data is missing");
   }

   const { name, description } = req.body;
   const playlistCover = req.file?.path;
   let playlistCoverPath;

   if (name === "" || description === "") {
      throw new ApiError(400, "All fields are required");
   }

   if (playlistCover) {
      playlistCoverPath = await uploadOnCloudinary(playlistCover);

      if (!playlistCoverPath) {
         throw new ApiError(
            500,
            "Something went wrong while uploading cover on cloudinary"
         );
      }
   }

   const playlist = await Playlist.create({
      name,
      description,
      playlistCover: playlistCover ? playlistCoverPath.url : "",
      owner: req.user._id,
   });

   return res
      .status(201)
      .json(new ApiResponse(200, playlist, "Playlist created successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
   const { videoId, playlistId } = req.params;

   if (!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new ApiError(400, "Invalid video id");
   }

   if (!mongoose.Types.ObjectId.isValid(playlistId)) {
      throw new ApiError(400, "Invalid playlist id");
   }

   const video = await Video.findById(videoId);

   if (!video) {
      throw new ApiError(404, "Video not found");
   }

   const playlist = await Playlist.findById(playlistId);

   if (!playlist) {
      throw new ApiError(404, "Playlist not found");
   }

   if(playlist.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You are not authorized to add videos into this playlist")
   }

   const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playlistId,
      {
         $push: {
            videos: {
               $each: [videoId],
               position: 0,
            },
         },
         $inc: {
            videoCount: 1,
         },
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
            updatedPlaylist,
            "Video added to the playlist successfully"
         )
      );
});

const getPlaylist = asyncHandler(async (req, res) => {
   const { playlistId } = req.params;

   const page = Number(req.query.page) || 1;
   const limit = Number(req.query.limit) || 10;

   if (!mongoose.Types.ObjectId.isValid(playlistId)) {
      throw new ApiError(400, "Invalid playlist id");
   }

   const isPlaylistExists = await Playlist.findById(playlistId);

   if (!isPlaylistExists) {
      throw new ApiError(404, "Playlist not found");
   }

   const playlist = await Playlist.aggregate([
      {
         $match: {
            _id: new mongoose.Types.ObjectId(playlistId),
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
                     avatar: 1,
                     fullName: 1,
                  },
               },
            ],
         },
      },
      {
         $addFields: {
            owner: {
               $first: "$owner",
            },
         },
      },
      {
         $lookup: {
            from: "videos",
            localField: "videos",
            foreignField: "_id",
            as: "videos",
            pipeline: [
               {
                  $match: {
                     isPublished: true
                  }
               },
               {
                  $project: {
                     title: 1,
                     thumbnail: 1,
                     owner: 1,
                     createdAt: 1
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
                              fullName: 1,
                           },
                        },
                     ],
                  },
               },
               {
                  $addFields: {
                     owner: {
                        $first: "$owner",
                     },
                  },
               },
               {
                  $skip: (page - 1) * limit
               },
               {
                  $limit: limit
               }
            ],
         },
      },
   ]);

   return res
      .status(200)
      .json(new ApiResponse(200, playlist[0], "Playlist fetched successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
   const userId = req.user._id;

   const playlists = await Playlist.aggregate([
      {
         $match: {
            owner: new mongoose.Types.ObjectId(userId),
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
                     fullName: 1,
                  },
               },
            ],
         },
      },
      {
         $addFields: {
            owner: {
               $first: "$owner",
            },
         },
      },
   ]);

   return res
      .status(200)
      .json(
         new ApiResponse(200, playlists, "User playlists fetched successfully")
      );
});

const editPlaylist = asyncHandler(async (req, res) => {
   const { playlistId } = req.params;

   if (!mongoose.Types.ObjectId.isValid(playlistId)) {
      throw new ApiError(400, "Invalid playlist id");
   }

   const playlist = await Playlist.findById(playlistId);

   if (!playlist) {
      throw new ApiError(404, "Playlist not found");
   }

   if (playlist.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You are not authorized to edit this playlist");
   }

   if (!req.body) {
      throw new ApiError(400, "Request data is missing");
   }

   const { name, description } = req.body;

   const playlistCover = req.file?.path;
   let playlistCoverPath;

   if (playlistCover) {
      if (playlist.playlistCover !== "") {
         await deleteFromCloudinary(playlist.playlistCover);
      }

      playlistCoverPath = await uploadOnCloudinary(playlistCover);

      if (!playlistCoverPath) {
         throw new ApiError(
            500,
            "Something went wrong while uploading cover on cloudinary"
         );
      }
   }

   let updateFields = {};

   if (name) updateFields.name = name;
   if (description) updateFields.description = description;
   if (playlistCover) updateFields.playlistCover = playlistCoverPath.url;

   if (Object.keys(updateFields).length === 0) {
      throw new ApiError(
         400,
         "At least one field is required to edit the playlist"
      );
   }

   const editedPlaylist = await Playlist.findByIdAndUpdate(
      playlistId,
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
         new ApiResponse(200, editedPlaylist, "Playlist edited successfully")
      );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
   const { playlistId, videoId } = req.params

   if(!mongoose.Types.ObjectId.isValid(playlistId)) {
      throw new ApiError(400, "Invalid playlist id")
   }

   if(!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new ApiError(400, "Invalid video id")
   }

   const playlist = await Playlist.findById(playlistId);

   if (!playlist) {
      throw new ApiError(404, "Playlist not found");
   }

   if (playlist.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You are not authorized to remove videos from playlist");
   }

   const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playlistId,
      {
         $pull: {
            videos: videoId
         },
         $inc: {
            videoCount: -1,
         },
      },
      {
         returnDocument: "after"
      }
   )

   return res
   .status(200)
   .json(new ApiResponse(200, updatedPlaylist, "Video removed successfully"))
})

const deletePlaylist = asyncHandler(async (req, res) => {
   const { playlistId } = req.params;

   if (!mongoose.Types.ObjectId.isValid(playlistId)) {
      throw new ApiError(400, "Invalid playlist id");
   }

   const playlist = await Playlist.findById(playlistId);

   if (!playlist) {
      throw new ApiError(404, "Playlist not found");
   }

   if (playlist.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You are not authorized to delete this playlist");
   }

   if (playlist.playlistCover !== "") {
      const deletion = await deleteFromCloudinary(playlist.playlistCover);

      if (!deletion) {
         throw new ApiError(
            500,
            "Something went wrong while deleting cover from cloudinary"
         );
      }
   }

   await Playlist.deleteOne({
      _id: new mongoose.Types.ObjectId(playlistId),
   });

   return res
      .status(200)
      .json(new ApiResponse(200, {}, "Playlist deleted successfully"));
});

export {
   createPlaylist,
   addVideoToPlaylist,
   getPlaylist,
   getUserPlaylists,
   editPlaylist,
   deletePlaylist,
   removeVideoFromPlaylist
};
