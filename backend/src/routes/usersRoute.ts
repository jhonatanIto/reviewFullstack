import { Router } from "express";
import { getUser } from "../controllers/userController.js";

const userRoute = Router();

userRoute.get("/", getUser);
