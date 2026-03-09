import { Router } from "express";
import { getProfile, searchUsers } from "../controllers/userController.js";

export const userRoute = Router();

userRoute.get("/search", searchUsers);
userRoute.get("/profile/:unique_id", getProfile);
