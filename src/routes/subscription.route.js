import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
   getChannelSubscribers,
   getMySubscribedChannels,
   toggleSubscription,
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter
   .route("/toggle/:channelId")
   .post(verifyJWT, toggleSubscription);

subscriptionRouter
   .route("/channel-subscribers/:channelId")
   .get(verifyJWT, getChannelSubscribers);
subscriptionRouter
   .route("/subscribed-channels/:userId")
   .get(verifyJWT, getMySubscribedChannels);

export default subscriptionRouter;
