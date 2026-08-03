import mongoose, { Schema } from "mongoose";

const searchSchema = new Schema({
   user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
   },
   recentSearches: [
      {
         type: String,
         required: true,
      },
   ],
});

export const Search = mongoose.model("Search", searchSchema);
