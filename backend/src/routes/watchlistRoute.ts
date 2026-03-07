import { Router } from "express";
import {
  deleteWatch,
  getWatch,
  postWatch,
} from "../controllers/watchController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const watchlistRouter = Router();

watchlistRouter.use(authMiddleware);

watchlistRouter.post("/", postWatch);
watchlistRouter.get("/", getWatch);
watchlistRouter.delete("/", deleteWatch);
