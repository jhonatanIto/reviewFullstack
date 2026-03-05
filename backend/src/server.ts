import express from "express";
import cors from "cors";
import "dotenv/config";
import { authRoute } from "./routes/authRoute.js";
import { cardsRoute } from "./routes/cardsRoute.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
  }),
);

app.get("/", (req, res) =>
  res.status(200).json({ message: "Welcome to the MyReview API" }),
);

app.use("/api/auth", authRoute);
app.use("/api/cards", cardsRoute);

app.listen(port, () => console.log("Server is running on port", port));
