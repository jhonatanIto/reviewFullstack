import { Server, Socket } from "socket.io";

export const registerSocketHandlers = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    socket.on("register", (userId: number) => {
      socket.join(`user:${userId}`);
    });

    socket.on("join_chat", (chatId: number) => {
      socket.join(`chat:${chatId}`);
    });

    socket.on("leave_chat", (chatId: number) => {
      socket.leave(`chat:${chatId}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
