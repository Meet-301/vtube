import mongoose, { Schema } from "mongoose";

const playlistSchema = new Schema(
   {
      name: {
         type: String,
         required: true,
         trim: true,
      },
      description: {
         type: String,
         required: true,
      },
      videoCount: {
         type: Number,
      },
      playlistCover: {
         type: String,
      },
      videos: [
         {
            type: Schema.Types.ObjectId,
            ref: "Video",
         },
      ],
      owner: {
         type: Schema.Types.ObjectId,
         ref: "User",
      },
   },
   { timestamps: true }
);

export const Playlist = mongoose.model("Playlist", playlistSchema);
