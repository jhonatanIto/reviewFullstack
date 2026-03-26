import { Router } from "express";
import {
  commentCard,
  deleteCard,
  deleteComment,
  getCard,
  getCardLogged,
  getCards,
  getComments,
  getCommentsLogged,
  getFollowingCards,
  homePageCards,
  likeComment,
  movieReviews,
  postCard,
  toggleLikeCard,
  updateCard,
} from "../controllers/cardsController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const cardsRoute = Router();

cardsRoute.get("/homePage", homePageCards);
cardsRoute.get("/movieReviews/:movieId", movieReviews);
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
cardsRoute.post("/commentLike/:commId", likeComment);
cardsRoute.get("/commentLogged/:cardId", getCommentsLogged);
cardsRoute.delete("/comment/:commentId", deleteComment);
