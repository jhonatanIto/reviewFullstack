import type { Request, Response } from "express";
import { db } from "../db/db.js";
import { users, cards, follows } from "../db/schema.js";
import { count, eq, ilike } from "drizzle-orm";

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    if (!q) return res.json([]);

    const userSearch = await db
      .select({
        unique_id: users.unique_id,
        name: users.name,
        picture: users.picture,
      })
      .from(users)
      .where(ilike(users.name, `%${q}%`))
      .limit(10);

    res.json(userSearch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const unique_id = req.params.unique_id as string;
    if (!unique_id)
      return res.status(400).json({ message: "Unique id not provided" });

    const [friend] = await db
      .select({
        name: users.name,
        picture: users.picture,
        unique_id: users.unique_id,
        id: users.id,
      })
      .from(users)
      .where(eq(users.unique_id, unique_id));

    if (!friend) return res.status(404).json({ message: "User not found" });

    const friendCards = await db
      .select()
      .from(cards)
      .where(eq(cards.user_id, friend.id));

    const [followers] = await db
      .select({ count: count() })
      .from(follows)
      .where(eq(follows.following_id, friend.id));

    const [following] = await db
      .select({ count: count() })
      .from(follows)
      .where(eq(follows.follower_id, friend.id));

    res.status(200).json({
      friend: {
        name: friend.name,
        picture: friend.picture,
        unique_id: friend.unique_id,
      },
      cards: friendCards,
      stats: {
        following: following?.count,
        followers: followers?.count,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
