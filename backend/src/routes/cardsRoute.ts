import { Router } from "express";
import {
  commentCard,
  deleteCard,
  getCard,
  getCardLogged,
  getCards,
  getComments,
  getFollowingCards,
  homePageCards,
  postCard,
  toggleLikeCard,
  updateCard,
} from "../controllers/cardsController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const cardsRoute = Router();

cardsRoute.get("/homePage", homePageCards);
cardsRoute.get("/:cardId", getCard);
cardsRoute.get("/comment/:cardId", getComments);

cardsRoute.use(authMiddleware);
cardsRoute.get("/protected/following", getFollowingCards);
cardsRoute.get("/:cardId/logged", getCardLogged);
cardsRoute.post("/", postCard);
cardsRoute.get("/", getCards);
cardsRoute.patch("/:cardId", updateCard);
cardsRoute.delete("/:cardId", deleteCard);
cardsRoute.post("/:cardId/likes", toggleLikeCard);

cardsRoute.post("/comment/:cardId", commentCard);
