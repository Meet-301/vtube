import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
   getUserNotifications,
   markNotificationAsRead,
   markAllNotificationsAsRead,
   clearAllNotifications,
} from "../controllers/notification.controller.js";

const notificationRouter = Router();

notificationRouter.route("/").get(verifyJWT, getUserNotifications);
notificationRouter.route("/read-all").patch(verifyJWT, markAllNotificationsAsRead);
notificationRouter.route("/clear").delete(verifyJWT, clearAllNotifications);
notificationRouter.route("/:id/read").patch(verifyJWT, markNotificationAsRead);

export default notificationRouter;
