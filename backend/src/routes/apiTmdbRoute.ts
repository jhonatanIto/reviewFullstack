import { Router } from "express";
import { homePageMovies, searchMovies } from "../controllers/tmdbController.js";

export const tmdbRouter = Router();

tmdbRouter.get("/", homePageMovies);
tmdbRouter.get("/search", searchMovies);
