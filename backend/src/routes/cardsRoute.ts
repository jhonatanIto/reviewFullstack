import { Router } from "express";
import { getCards, postCard } from "../controllers/cardsController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const cardsRoute = Router();

cardsRoute.use(authMiddleware);
cardsRoute.post("/", postCard);
cardsRoute.get("/", getCards);
