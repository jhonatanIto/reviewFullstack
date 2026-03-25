import express from "express";
import cors from "cors";
import "dotenv/config";
import { authRoute } from "./routes/authRoute.js";
import { cardsRoute } from "./routes/cardsRoute.js";
import { watchlistRouter } from "./routes/watchlistRoute.js";
import { userRoute } from "./routes/usersRoute.js";
import googleRoute from "./routes/googleRoute.js";
import { notificationRoute } from "./routes/notificationsRoute.js";
import { chatRoute } from "./routes/chatRoute.js";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { initSocket } from "./socket/index.js";
import { registerSocketHandlers } from "./socket/handlers.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://review-fullstack.vercel.app"],
  }),
);

const httpServer = createServer(app);
const io = initSocket(httpServer);
registerSocketHandlers(io);

app.get("/", (req, res) =>
  res.status(200).json({ message: "Welcome to the MyReview API" }),
);

app.use("/api/auth", authRoute);
app.use("/api/cards", cardsRoute);
app.use("/api/watchlist", watchlistRouter);
app.use("/api/users", userRoute);
app.use("/api/googleAuth", googleRoute);
app.use("/api/notification", notificationRoute);
app.use("/api/chat", chatRoute);

httpServer.listen(port, () => console.log("Server is running on port", port));
