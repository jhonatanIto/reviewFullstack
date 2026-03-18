import { Router } from "express";
import {
  getNotification,
  markAllRead,
  markAsRead,
} from "../controllers/notificationController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const notificationRoute = Router();

notificationRoute.use(authMiddleware);

notificationRoute.get("/", getNotification);
notificationRoute.patch("/:id/read", markAsRead);
notificationRoute.patch("/read-all", markAllRead);
notificationRoute.get("/unread-count");
