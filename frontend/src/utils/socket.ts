import { io } from "socket.io-client";
import { backend } from "./fetchData";

export const socket = io(backend, {
  transports: ["websocket"],
  withCredentials: true,
});
