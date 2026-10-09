import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Notification } from "../models/notification.model.js";

const getUserNotifications = asyncHandler(async (req, res) => {
   const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

   const unreadCount = notifications.filter((n) => !n.isRead).length;

   return res.status(200).json(
      new ApiResponse(
         200,
         {
            notifications: notifications.map((n) => ({
               ...n,
               id: n._id.toString(),
               unread: !n.isRead,
            })),
            unreadCount,
         },
         "Notifications fetched successfully"
      )
   );
});

const markNotificationAsRead = asyncHandler(async (req, res) => {
   const { id } = req.params;

   if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid notification id");
   }

   const notification = await Notification.findOneAndUpdate(
      { _id: id, recipient: req.user._id },
      { $set: { isRead: true } },
      { new: true }
   );

   if (!notification) {
      throw new ApiError(404, "Notification not found");
   }

   return res
      .status(200)
      .json(new ApiResponse(200, notification, "Notification marked as read"));
});

const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
   await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { $set: { isRead: true } }
   );

   return res
      .status(200)
      .json(new ApiResponse(200, {}, "All notifications marked as read"));
});

const clearAllNotifications = asyncHandler(async (req, res) => {
   await Notification.deleteMany({ recipient: req.user._id });

   return res
      .status(200)
      .json(new ApiResponse(200, {}, "All notifications cleared"));
});

export {
   getUserNotifications,
   markNotificationAsRead,
   markAllNotificationsAsRead,
   clearAllNotifications,
};
