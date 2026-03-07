import { Router } from "express";
import { searchUsers } from "../controllers/userController.js";

const userRoute = Router();

userRoute.get("/", searchUsers);
