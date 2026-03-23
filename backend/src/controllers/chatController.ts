import type { Request, Response } from "express";
import { db } from "../db/db.js";
import { chats, chatUsers, messages, users } from "../db/schema.js";
import { eq, inArray, sql } from "drizzle-orm";

export const userChatInfo = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const unique_id = req.params.unique_id as string;

    if (!unique_id) {
      return res.status(400).json({ message: "unique id required" });
    }
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const [friend] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.unique_id, unique_id));

    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }
    if (friend.id === userId) {
      return res.status(400).json({ message: "Cannot chat with yourself" });
    }

    let chatId: number;

    const existingChat = await db
      .select({ chat_id: chatUsers.chat_id })
      .from(chatUsers)
      .where(inArray(chatUsers.user_id, [userId, friend.id]))
      .groupBy(chatUsers.chat_id)
      .having(sql`count(distinct ${chatUsers.user_id}) = 2`);

    if (!existingChat.length) {
      const [newChat] = await db
        .insert(chats)
        .values({ last_message: null, last_message_at: null })
        .returning({ id: chats.id });

      chatId = newChat?.id!;

      await db.insert(chatUsers).values([
        { chat_id: chatId, user_id: userId },
        { chat_id: chatId, user_id: friend.id },
      ]);
    } else {
      chatId = Number(existingChat[0]?.chat_id);
    }

    const messagesList = await db
      .select()
      .from(messages)
      .where(eq(messages.chat_id, chatId))
      .orderBy(sql`${messages.created_at} asc`);

    const usersInChat = await db
      .select({
        id: users.id,
        name: users.name,
        picture: users.picture,
        unique_id: users.unique_id,
      })
      .from(chatUsers)
      .innerJoin(users, eq(chatUsers.user_id, users.id))
      .where(eq(chatUsers.chat_id, chatId));

    res
      .status(200)
      .json({ chatId, users: usersInChat, messages: messagesList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
