import { Router } from "express";
import {
  deleteCard,
  getCard,
  getCards,
  getFollowingCards,
  homePageCards,
  postCard,
  toggleLikeCard,
  updateCard,
} from "../controllers/cardsController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const cardsRoute = Router();

cardsRoute.get("/homePage", homePageCards);
cardsRoute.use(authMiddleware);

cardsRoute.post("/", postCard);
cardsRoute.get("/", getCards);
cardsRoute.patch("/:cardId", updateCard);
cardsRoute.delete("/:cardId", deleteCard);
cardsRoute.post("/:cardId/likes", toggleLikeCard);
cardsRoute.get("/following", getFollowingCards);
cardsRoute.get("/:cardId", getCard);
