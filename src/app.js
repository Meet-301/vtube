//! express app configuration
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "./config/passport.js";

const app = express(); //! new server instance of express application

app.use(
   cors({
      origin: process.env.CORS_ORIGIN,
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

//! routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1", searchRouter);

export default app;
