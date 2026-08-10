import mongoose, { Schema } from "mongoose";

const timestampNoteSchema = new Schema(
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

export const TimestampNote = mongoose.model(
   "TimestampNote",
   timestampNoteSchema
);
