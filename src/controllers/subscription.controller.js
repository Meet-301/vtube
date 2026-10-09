import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import ApiResponse from "../utils/ApiResponse.js";

const toggleSubscription = asyncHandler(async (req, res) => {
   const { channelId } = req.params;

   if (!mongoose.Types.ObjectId.isValid(channelId)) {
      throw new ApiError(400, "Invalid channel id");
   }

   if (String(channelId) === String(req.user._id)) {
      throw new ApiError(400, "You cannot subscribe to your own channel");
   }

   const channel = await User.findById(channelId);

   if (!channel) {
      throw new ApiError(404, "Channel not found");
   }

   const isSubscriptionExists = await Subscription.exists({
      subscriber: req.user._id,
      channel: channelId,
   });

   let isSubscribed;

   if (isSubscriptionExists) {
      await Subscription.deleteOne({
         subscriber: req.user._id,
         channel: channelId,
      });
      isSubscribed = false;
   } else {
      await Subscription.create({
         subscriber: req.user._id,
         channel: channelId,
      });
      isSubscribed = true;

      // Real-time socket notification to creator
      try {
         const io = req.app.get("io");
         if (io) {
            io.to(channelId.toString()).emit("new_notification", {
               type: "SUBSCRIBER",
               message: `${req.user.fullName || req.user.username} subscribed to your channel!`,
               avatar: req.user.avatar,
               subscriberId: req.user._id,
               createdAt: new Date().toISOString(),
            });
         }
      } catch (err) {
         console.log("Socket notification error (subscription):", err);
      }
   }

   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            { isSubscribed },
            isSubscribed
               ? "Channel subscribed successfully"
               : "Channel unsubscribed successfully"
         )
      );
});

const getChannelSubscribers = asyncHandler(async (req, res) => {
   const { channelId } = req.params;

   if (!mongoose.Types.ObjectId.isValid(channelId)) {
      throw new ApiError(400, "Invalid channel id");
   }

   const subscribers = await Subscription.find({ channel: channelId });

   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            subscribers.length == 0 ? 0 : subscribers,
            "Channel subscribers fetched successfully"
         )
      );
});

const getMySubscribedChannels = asyncHandler(async (req, res) => {
   const subscriberId = req.params.userId || req.user._id;

   if (!mongoose.Types.ObjectId.isValid(subscriberId)) {
      throw new ApiError(400, "Invalid user id");
   }

   const subscribedChannels = await Subscription.aggregate([
      {
         $match: {
            subscriber: new mongoose.Types.ObjectId(subscriberId),
         },
      },
      {
         $lookup: {
            from: "users",
            localField: "channel",
            foreignField: "_id",
            as: "channel",
            pipeline: [
               {
                  $project: {
                     fullName: 1,
                     username: 1,
                     avatar: 1,
                  },
               },
            ],
         },
      },
      {
         $unwind: "$channel",
      },
      {
         $lookup: {
            from: "subscriptions",
            localField: "channel._id",
            foreignField: "channel",
            as: "subscribers",
         },
      },
      {
         $addFields: {
            "channel.subscribersCount": { $size: "$subscribers" },
         },
      },
      {
         $project: {
            _id: 1,
            channel: 1,
            createdAt: 1,
         },
      },
      {
         $sort: { createdAt: -1 },
      },
   ]);

   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            subscribedChannels,
            "My subscribed channels fetched successfully"
         )
      );
});

export { toggleSubscription, getChannelSubscribers, getMySubscribedChannels };
