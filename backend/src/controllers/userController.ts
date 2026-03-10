import type { Request, Response } from "express";
import { db } from "../db/db.js";
import { users, cards, follows, likes, comments } from "../db/schema.js";
import { and, desc, eq, ilike, sql, count } from "drizzle-orm";

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;
    const type = req.query.type as string;

    if (!q || q.length < 2 || (type !== "name" && type !== "id")) {
      return res.json([]);
    }

    const column = type === "name" ? users.name : users.unique_id;

    const userSearch = await db
      .select({
        unique_id: users.unique_id,
        name: users.name,
        picture: users.picture,
      })
      .from(users)
      .where(ilike(column, `%${q}%`))
      .limit(10);

    res.json(userSearch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  const unique_id = req.params.unique_id as string;
  const userId = req.userId;

  if (!unique_id || !userId)
    return res
      .status(400)
      .json({ message: "Unique id or userId not provided" });

  try {
    const [profile] = await db
      .select({
        name: users.name,
        picture: users.picture,
        unique_id: users.unique_id,
        id: users.id,

        followers: sql<number>`
        (SELECT COUNT(*)::int
        FROM follows
        WHERE following_id = ${users.id}
        )`,

        following: sql<number>`
        (SELECT COUNT(*)::int
        FROM follows
        WHERE follower_id = ${users.id}
        )
        `,

        isFollowing: sql<boolean>`
        EXISTS (
          SELECT 1
          FROM follows
          WHERE follower_id = ${userId}
          AND following_id = ${users.id}
        )`,
      })
      .from(users)
      .where(eq(users.unique_id, unique_id));

    if (!profile) return res.status(404).json({ message: "User not found" });

    const profileCards = await db
      .select({
        id: cards.id,
        title: cards.title,
        poster: cards.poster,
        description: cards.description,
        created_at: cards.created_at,
        rate: cards.rate,
        review: cards.review,

        likes_count: count(sql`distinct ${likes.id}`),
        comments_count: count(sql`distinct ${comments.id}`),

        liked_by_user: sql<boolean>`
        EXISTS( 
          SELECT 1
          FROM likes
          WHERE likes.card_id = ${cards.id}
          AND likes.user_id = ${userId}
        )`,
      })
      .from(cards)
      .leftJoin(likes, eq(likes.card_id, cards.id))
      .leftJoin(comments, eq(comments.card_id, cards.id))
      .where(eq(cards.user_id, profile.id))
      .groupBy(cards.id)
      .orderBy(desc(cards.created_at));

    res.status(200).json({
      user: {
        name: profile.name,
        picture: profile.picture,
        unique_id: profile.unique_id,
      },
      stats: {
        followers: profile.followers,
        following: profile.following,
      },
      isFollowing: profile.isFollowing,
      cards: profileCards,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const toggleFollow = async (req: Request, res: Response) => {
  const followerId = Number(req.userId);
  const unique_id = String(req.params.unique_id);

  if (!followerId || !unique_id)
    return res.status(400).json({ message: "Id not provided" });

  const [following] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.unique_id, unique_id));

  if (!following) return res.status(404).json({ message: "User not found" });

  if (followerId === following.id)
    return res.status(400).json({ message: "You cannot follow yourself" });

  const [existing] = await db
    .select()
    .from(follows)
    .where(
      and(
        eq(follows.follower_id, followerId),
        eq(follows.following_id, following.id),
      ),
    );

  if (existing) {
    await db
      .delete(follows)
      .where(
        and(
          eq(follows.follower_id, followerId),
          eq(follows.following_id, following.id),
        ),
      );

    return res.json({ following: false });
  }

  await db
    .insert(follows)
    .values({ follower_id: followerId, following_id: following.id })
    .onConflictDoNothing();

  res.json({ following: true });
};

export const getFollowing = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(400).json({ message: "Unauthorized" });

    const following = await db
      .select({
        name: users.name,
        unique_id: users.unique_id,
        picture: users.picture,
        reviews: sql<number>`
        (SELECT COUNT(*)::int
        FROM cards
        WHERE user_id = ${users.id}
        )`,
      })
      .from(follows)
      .innerJoin(users, eq(users.id, follows.following_id))
      .where(eq(follows.follower_id, userId));

    res.status(200).json({ following });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
