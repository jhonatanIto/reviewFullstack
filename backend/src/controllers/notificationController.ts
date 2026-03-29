import type { Request, Response } from "express";
import { db } from "../db/db.js";
import { cards, follows, notifications, users } from "../db/schema.js";
import { and, desc, eq, sql } from "drizzle-orm";

export const getNotification = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const limit = Math.min(Number(req.query.limit) || 20, 50);
    const offset = Math.max(Number(req.query.offset) || 0, 0);

    const result = await db
      .select({
        id: notifications.id,
        type: notifications.type,
        is_read: notifications.is_read,
        created_at: notifications.created_at,

        from_user: {
          unique_id: users.unique_id,
          name: users.name,
          picture: users.picture,
        },
        card_id: notifications.card_id,
        card_picture: cards.poster,
        comment_id: notifications.comment_id,
        isFollowing: sql<boolean>`
        EXISTS(
          SELECT 1
          FROM follows
          WHERE follower_id = ${userId}
          AND following_id = ${users.id}
        )`,
      })
      .from(notifications)
      .leftJoin(users, eq(users.id, notifications.from_user_id))
      .leftJoin(cards, eq(cards.id, notifications.card_id))
      .where(eq(notifications.user_id, userId))
      .orderBy(desc(notifications.created_at))
      .limit(limit)
      .offset(offset);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const notificationId = Number(req.params.id);

    await db
      .update(notifications)
      .set({ is_read: 1 })
      .where(
        and(
          eq(notifications.id, notificationId),
          eq(notifications.user_id, userId),
        ),
      );

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const markAllRead = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    (await db
      .update(notifications)
      .set({ is_read: 1 })
      .where(eq(notifications.user_id, userId)),
      res.json({ success: true }));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(notifications)
      .where(
        and(eq(notifications.user_id, userId), eq(notifications.is_read, 0)),
      );

    res.json({ count: result[0]?.count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
