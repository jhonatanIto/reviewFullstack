import { Router } from "express";
import {
  getFollowing,
  getProfile,
  getProfileLogged,
  isTokenValid,
  searchUsers,
  toggleFollow,
  userChatInfo,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const userRoute = Router();

userRoute.get("/profile/:unique_id", getProfile);

userRoute.use(authMiddleware);
userRoute.get("/me", isTokenValid);
userRoute.get("/search", searchUsers);
userRoute.get("/profile/:unique_id/logged", getProfileLogged);
userRoute.post("/:unique_id/follow", toggleFollow);
userRoute.get("/following", getFollowing);
userRoute.get("/userChatInfo/:unique_id", userChatInfo);
