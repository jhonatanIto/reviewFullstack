import type { Request, Response } from "express";
import { db } from "../db/db.js";
import { chats, chatUsers, messages, users } from "../db/schema.js";
import { and, desc, eq, inArray, isNull, ne, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { getIO } from "../socket/index.js";

interface SendMessageBody {
  message: string;
  chatId: number;
}

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

    await db
      .update(messages)
      .set({ read_at: new Date() })
      .where(
        and(
          eq(messages.chat_id, chatId),
          ne(messages.sender_id, userId),
          isNull(messages.read_at),
        ),
      );

    res
      .status(200)
      .json({ chatId, users: usersInChat, messages: messagesList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { message, chatId } = req.body as SendMessageBody;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!message?.trim() || !chatId) {
      return res.status(400).json({ message: "Message or Chat id missing" });
    }

    const now = new Date();

    const usersInChat = await db
      .select({ user_id: chatUsers.user_id })
      .from(chatUsers)
      .where(eq(chatUsers.chat_id, chatId));

    const isUserInChat = usersInChat.some((u) => u.user_id === userId);

    if (!isUserInChat) {
      return res.status(403).json({ message: "Not part of this chat" });
    }

    const [postMessage] = await db
      .insert(messages)
      .values({ chat_id: chatId, sender_id: userId, content: message })
      .returning();

    if (!postMessage) {
      return res.status(500).json({ message: "Failed to create message" });
    }

    await db
      .update(chats)
      .set({ last_message: message, last_message_at: now })
      .where(eq(chats.id, chatId));

    await db
      .update(chatUsers)
      .set({
        unread_count: sql`${chatUsers.unread_count} + 1`,
      })
      .where(and(eq(chatUsers.chat_id, chatId), ne(chatUsers.user_id, userId)));

    const io = getIO();

    io.to(`chat:${chatId}`).emit("new_message", {
      id: postMessage.id,
      content: postMessage.content,
      sender_id: postMessage.sender_id,
      chat_id: postMessage.chat_id,
      created_at: postMessage.created_at,
    });

    usersInChat.forEach((u) => {
      io.to(`user:${u.user_id}`).emit("chat_updated", {
        chatId,
        lastMessage: message,
        lastMessageAt: now,
        senderId: userId,
      });
    });

    res.status(201).json({
      status: "Message sent",
      data: {
        id: postMessage.id,
        content: postMessage.content,
        sender_id: postMessage.sender_id,
        chat_id: postMessage.chat_id,
        created_at: postMessage.created_at,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const chatList = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const chatUsers2 = alias(chatUsers, "chatUsers2");

    const result = await db
      .select({
        chatId: chats.id,
        lastMessage: chats.last_message,
        lastMessageAt: chats.last_message_at,

        userId: users.id,
        name: users.name,
        picture: users.picture,
        unique_id: users.unique_id,

        unreadCount: sql<number>`
        count(
          case 
            when ${messages.chat_id} = ${chats.id}
            and ${messages.read_at} IS null
            and ${messages.sender_id} != ${userId}
            then 1
            end
        )`.as("unreadCount"),
      })
      .from(chatUsers)
      .innerJoin(chats, eq(chatUsers.chat_id, chats.id))
      .innerJoin(chatUsers2, eq(chatUsers.chat_id, chatUsers2.chat_id))
      .innerJoin(users, eq(chatUsers2.user_id, users.id))

      .leftJoin(messages, eq(messages.chat_id, chats.id))

      .where(and(eq(chatUsers.user_id, userId), ne(users.id, userId)))
      .groupBy(
        chats.id,
        users.id,
        users.name,
        users.picture,
        users.unique_id,
        chats.last_message,
        chats.last_message_at,
      )
      .orderBy(desc(chats.last_message_at));

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
