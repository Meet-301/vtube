//! express app configuration
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "./config/passport.js";

const app = express(); //! new server instance of express application

export const isAllowedOrigin = (origin) => {
   if (!origin) return true;
   const cleanOrigin = origin.replace(/\/$/, "");

   const configuredOrigins = process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim().replace(/\/$/, ""))
      : ["http://localhost:5173"];

   if (configuredOrigins.includes(cleanOrigin) || configuredOrigins.includes("*")) {
      return true;
   }

   // Localhost with any port (5173, 3000, etc.)
   if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(cleanOrigin)) {
      return true;
   }

   // Local network IP addresses for tablet/mobile Wi-Fi testing
   if (/^http:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)(:\d+)?$/.test(cleanOrigin)) {
      return true;
   }

   // Any Vercel deployment domain (*.vercel.app)
   if (/^https:\/\/[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.vercel\.app$/.test(cleanOrigin)) {
      return true;
   }

   return false;
};

app.use(
   cors({
      origin: (origin, callback) => {
         if (isAllowedOrigin(origin)) {
            callback(null, true);
         } else {
            callback(new Error(`Origin ${origin} not allowed by CORS`));
         }
      },
      credentials: true,
   })
);

app.use(express.json({ limit: "16kb" })); //! for data that comes from json(it'll accept 16kb)
app.use(express.urlencoded({ extended: true }));
//! for data that comes from HTML form
app.use(express.static("public")); //! for assets that will be available publicly via folder named "public"
app.use(cookieParser()); //! to set and get cookies in user browser
app.use(passport.initialize())

//! routes import
import userRouter from "./routes/user.route.js";
import videoRouter from "./routes/video.route.js";
import likeRouter from "./routes/like.route.js";
import commentRouter from "./routes/comment.route.js";
import playlistRouter from "./routes/playlist.route.js";
import subscriptionRouter from "./routes/subscription.route.js";
import searchRouter from "./routes/search.route.js";
import videoNoteRouter from "./routes/videoNote.route.js";
import notificationRouter from "./routes/notification.route.js";
import ApiResponse from "./utils/ApiResponse.js";

//! routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/video-notes", videoNoteRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1", searchRouter);
app.get("/", (req, res) => {
   res.json(new ApiResponse(200, [], "Hey, Welcome to VTube"))
})

export default app;
