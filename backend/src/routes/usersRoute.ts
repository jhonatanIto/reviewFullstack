import { Router } from "express";
import {
  getFollowing,
  getProfile,
  getProfileLogged,
  searchUsers,
  toggleFollow,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const userRoute = Router();

userRoute.get("/search", searchUsers);
userRoute.get("/profile/:unique_id", getProfile);

userRoute.use(authMiddleware);
userRoute.get("/profile/:unique_id/logged", getProfileLogged);
userRoute.post("/:unique_id/follow", toggleFollow);
userRoute.get("/following", getFollowing);
