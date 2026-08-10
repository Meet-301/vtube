import mongoose, { Schema } from "mongoose";

const videoNoteSchema = new Schema(
   {
      owner: {
         type: Schema.Types.ObjectId,
         ref: "User",
      },
      videoId: {
         type: Schema.Types.ObjectId,
         ref: "Video",
      },
      timestamp: {
         type: Number,
         required: true,
      },
      title: {
         type: String,
         required: true,
      },
      description: {
         type: String,
         required: true,
      },
   },
   { timestamps: true }
);

export const VideoNote = mongoose.model(
   "VideoNote",
   videoNoteSchema
);
