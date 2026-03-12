import { Router } from "express";
import { googleAuth } from "../controllers/googleController.js";

const googleRoute = Router();
googleRoute.post("/", googleAuth);

export default googleRoute;
