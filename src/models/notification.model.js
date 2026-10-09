import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
   {
      recipient: {
         type: Schema.Types.ObjectId,
         ref: "User",
         required: true,
         index: true,
      },
      sender: {
         type: Schema.Types.ObjectId,
         ref: "User",
      },
      type: {
         type: String,
         enum: ["SUBSCRIBER", "NEW_VIDEO"],
         required: true,
      },
      message: {
         type: String,
         required: true,
      },
      avatar: {
         type: String,
      },
      videoId: {
         type: Schema.Types.ObjectId,
         ref: "Video",
      },
      thumbnail: {
         type: String,
      },
      subscriberUsername: {
         type: String,
      },
      isRead: {
         type: Boolean,
         default: false,
      },
   },
   { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
