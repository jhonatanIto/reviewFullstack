import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  chatList,
  markAsRead,
  sendMessage,
  userChatInfo,
} from "../controllers/chatController.js";

export const chatRoute = Router();

chatRoute.use(authMiddleware);
chatRoute.get("/info/:unique_id", userChatInfo);
chatRoute.post("/sendMessage", sendMessage);
chatRoute.get("/chatList", chatList);
chatRoute.patch("/markAsRead/:chatId", markAsRead);
