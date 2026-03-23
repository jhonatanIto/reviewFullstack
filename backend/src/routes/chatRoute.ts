import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { userChatInfo } from "../controllers/chatController.js";

export const chatRoute = Router();

chatRoute.use(authMiddleware);
chatRoute.get("/info/:unique_id", userChatInfo);
