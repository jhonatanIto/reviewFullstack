import { Router } from "express";
import {
  deleteCard,
  getCards,
  postCard,
  updateCard,
} from "../controllers/cardsController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const cardsRoute = Router();

cardsRoute.use(authMiddleware);

cardsRoute.post("/", postCard);
cardsRoute.get("/", getCards);
cardsRoute.patch("/:cardId", updateCard);
cardsRoute.delete("/:cardId", deleteCard);
