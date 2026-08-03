import { Playlist } from "../models/playlist.model.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const search = asyncHandler(async (req, res) => {
   let {
      query,
      type = "video",
      sortBy = "latest",
      page = "1",
      limit = "10",
   } = req.query;

   page = Number(page);
   limit = Number(limit);

   if (page <= 0 || limit <= 0) {
      throw new ApiError(400, "Invalid page number or limit number");
   }

   let sort;

   query = query?.trim();

   if (!query) {
      throw new ApiError(400, "Search query is empty");
   }

   if (sortBy === "latest") {
      sort = {
         createdAt: -1,
      };
   } else if (sortBy === "oldest") {
      sort = {
         createdAt: 1,
      };
   } else if (sortBy === "mostliked") {
      sort = {
         likes: -1,
      };
   } else {
      sort = {
         views: -1,
      };
   }

   const words = query.split(/\s+/);

   const videoSearchConditions = words.flatMap((word) => {
      const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      return [
         {
            title: {
               $regex: escaped,
               $options: "i",
            },
         },
         {
            description: {
               $regex: escaped,
               $options: "i",
            },
         },
      ];
   });

   const playlistSearchConditions = words.flatMap((word) => {
      const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      return [
         {
            name: {
               $regex: word,
               $options: "i",
            },
         },
         {
            description: {
               $regex: word,
               $options: "i",
            },
         },
      ];
   });

   const channelSearchConditions = words.flatMap((word) => {
      const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      return [
         {
            fullName: {
               $regex: word,
               $options: "i",
            },
         },
         {
            userrname: {
               $regex: word,
               $options: "i",
            },
         },
      ];
   });

   if (type === "video") {
      //! search by video

      const totalCount = await Video.aggregate([
         {
            $match: {
               $or: videoSearchConditions,
            },
         },
         {
            $count: "total",
         },
      ]);

      const videos = await Video.aggregate([
         {
            $match: {
               $or: videoSearchConditions,
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
               owner: { $first: "$owner" },
            },
         },
         {
            $sort: sort,
         },
         {
            $skip: (page - 1) * limit,
         },
         {
            $limit: limit,
         },
      ]);

      const total = totalCount[0]?.total || 0;
      let totalPages;

      if (total !== 0) {
         totalPages = Math.ceil(total / limit);
      }

      const response = {
         results: videos,
         totalResults: total,
         currentPage: page,
         totalPages: totalPages ?? 0,
      };

      return res
         .status(200)
         .json(new ApiResponse(200, response, "Videos fetched successfully"));
   } else if (type === "playlist") {
      //! search by playlist
      let playlistSort =
         sortBy === "oldest"
            ? {
                 createdAt: 1,
              }
            : {
                 createdAt: -1,
              };

      const totalCount = await Playlist.aggregate([
         {
            $match: {
               $or: playlistSearchConditions,
            },
         },
         {
            $count: "total",
         },
      ]);

      const playlists = await Playlist.aggregate([
         {
            $match: {
               $or: playlistSearchConditions,
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
                        avatar: 1,
                     },
                  },
               ],
            },
         },
         {
            $addFields: { owner: { $first: "$owner" } },
         },
         {
            $sort: playlistSort,
         },
         {
            $skip: (page - 1) * limit,
         },
         {
            $limit: limit,
         },
      ]);

      const total = totalCount[0]?.total || 0;
      let totalPages;

      if (total !== 0) {
         totalPages = Math.ceil(total / limit);
      }

      const response = {
         results: playlists,
         totalResults: total,
         currentPage: page,
         totalPages: totalPages ?? 0,
      };

      return res
         .status(200)
         .json(
            new ApiResponse(200, response, "Playlists fetched successfully")
         );
   } else if (type === "channel") {
      const totalCount = await User.aggregate([
         {
            $match: {
               $or: channelSearchConditions,
            },
         },
         {
            $count: "total",
         },
      ]);

      const channels = await User.aggregate([
         {
            $match: {
               $or: channelSearchConditions,
            },
         },
         {
            $lookup: {
               from: "subscriptions",
               localField: "_id",
               foreignField: "channel",
               as: "subscribers",
            },
         },
         {
            $addFields: {
               subscribersCount: { $size: "$subscribers" },
               isSubscribed: {
                  $cond: {
                     if: { $in: [req.user._id, "$subscribers.subscriber"] },
                     then: true,
                     else: false,
                  },
               },
            },
         },
         {
            $project: {
               avatar: 1,
               username: 1,
               isSubscribed: 1,
               subscribersCount: 1,
            },
         },
         {
            $skip: (page - 1) * limit,
         },
         {
            $limit: limit,
         },
      ]);

      const total = totalCount[0]?.total || 0;
      let totalPages;

      if (total !== 0) {
         totalPages = Math.ceil(total / limit);
      }

      const response = {
         results: channels,
         totalResults: total,
         currentPage: page,
         totalPages: totalPages ?? 0,
      };

      return res
         .status(200)
         .json(new ApiResponse(200, response, "Channels fetched successfully"));
   } else {
      throw new ApiError(400, "Invalid search type");
   }
});

export { search };
