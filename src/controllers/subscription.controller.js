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

   const channel = await User.findById(channelId);

   if (!channel) {
      throw new ApiError(404, "Channel not found");
   }

   const isSubscriptionExists = await Subscription.exists({
      subscriber: req.user._id,
      channel: channelId,
   });

   let isSubscribed;
   let data;

   if (isSubscriptionExists) {
      data = await Subscription.deleteOne({
         subscriber: req.user._id,
         channel: channelId,
      });
      isSubscribed = false;
   } else {
      data = await Subscription.create({
         subscriber: req.user._id,
         channel: channelId,
      });
      isSubscribed = true;
   }

   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            data,
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
   const subscribedChannels = await Subscription.find({
      subscriber: req.user._id,
   });

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
