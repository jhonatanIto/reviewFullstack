import { Router } from "express";
import { homePageMovies } from "../controllers/tmdbController.js";

export const tmdbRouter = Router();

tmdbRouter.get("/", homePageMovies);
