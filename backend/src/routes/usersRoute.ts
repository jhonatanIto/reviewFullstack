import { Router } from "express";
import {
  getFollowing,
  getProfile,
  searchUsers,
  toggleFollow,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const userRoute = Router();

userRoute.get("/search", searchUsers);

userRoute.use(authMiddleware);
userRoute.get("/profile/:unique_id", getProfile);
userRoute.post("/:unique_id/follow", toggleFollow);
userRoute.get("/following", getFollowing);

// userRoute.get("/:unique_id/followers");
// userRoute.get("/:unique_id/following");
