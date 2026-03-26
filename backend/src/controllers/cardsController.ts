import type { Request, Response } from "express";
import { db } from "../db/db.js";
import {
  cards,
  comment_likes,
  comments,
  follows,
  likes,
  users,
} from "../db/schema.js";
import {
  and,
  asc,
  count,
  desc,
  eq,
  sql,
  type InferInsertModel,
} from "drizzle-orm";
import { notificationQueue } from "../queues/notificationQueue.js";

type NewCard = InferInsertModel<typeof cards>;

export const postCard = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const {
      title,
      release,
      description,
      poster,
      rate,
      review,
      banner,
      tmdb_id,
    } = req.body;

    if (!title || !rate || !poster || !release || !description || !tmdb_id) {
      return res.status(400).json({ message: "Missing fields" });
    }
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const movie: NewCard = {
      title,
      release,
      description,
      poster,
      banner: banner ? banner : null,
      rate,
      review: review ? review : null,
      tmdb_id,
      user_id: userId,
    };

    await db.insert(cards).values(movie);

    res.status(201).json({ message: "Card created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCards = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const userCards = await db
      .select({
        id: cards.id,
        title: cards.title,
        poster: cards.poster,
        description: cards.description,
        rate: cards.rate,
        review: cards.review,
        tmdb_id: cards.tmdb_id,
        created_at: cards.created_at,
        release: cards.release,
        likes_count: count(sql`distinct ${likes.id}`),
        comments_count: count(sql`distinct ${comments.id}`),
        liked_by_user: sql<boolean>`
        EXISTS (
          SELECT 1 
          FROM likes
          WHERE likes.card_id = ${cards.id}
          AND likes.user_id = ${userId}
        )`,
      })
      .from(cards)
      .leftJoin(likes, eq(likes.card_id, cards.id))
      .leftJoin(comments, eq(comments.card_id, cards.id))
      .groupBy(cards.id)
      .orderBy(desc(cards.created_at))
      .limit(30)
      .where(eq(cards.user_id, userId));

    res.status(200).json(userCards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCard = async (req: Request, res: Response) => {
  try {
    const cardId = Number(req.params.cardId);

    if (!cardId) return res.status(400).json({ message: "Card id required" });

    const [card] = await db
      .select({
        id: cards.id,
        title: cards.title,
        poster: cards.poster,
        description: cards.description,
        rate: cards.rate,
        review: cards.review,
        tmdb_id: cards.tmdb_id,
        created_at: cards.created_at,
        release: cards.release,

        user_name: users.name,
        user_unique_id: users.unique_id,
        user_picture: users.picture,

        likes_count: sql<number>`
        (
          SELECT COUNT(*)::int
          FROM likes
          WHERE likes.card_id = ${cards.id}
        )`,
        comments_count: sql<number>`
        (
          SELECT COUNT(*)
          FROM comments
          WHERE comments.card_id = ${cards.id}
        )`,
      })
      .from(cards)
      .innerJoin(users, eq(users.id, cards.user_id))
      .where(eq(cards.id, cardId));

    res.status(200).json(card);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const updateCard = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { cardId } = req.params;

    if (!userId) return;
    if (!cardId) return;

    const updates: any = {};

    if (req.body.rate !== undefined) updates.rate = req.body.rate;
    if (req.body.review !== undefined) updates.review = req.body.review;

    const [updatedCard] = await db
      .update(cards)
      .set(updates)
      .where(and(eq(cards.user_id, userId), eq(cards.id, Number(cardId))))
      .returning();

    if (!updatedCard)
      return res.status(404).json({ message: "Card not found" });

    res.status(200).json({ message: "Card updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteCard = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { cardId } = req.params;

    if (!userId) return;
    if (!cardId) return;

    const [deletedCard] = await db
      .delete(cards)
      .where(and(eq(cards.user_id, userId), eq(cards.id, Number(cardId))))
      .returning();

    if (!deletedCard)
      return res.status(404).json({ message: "Card not found" });

    res.status(200).json({ message: "Card deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const toggleLikeCard = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const cardId = Number(req.params.cardId);

    if (!userId || !cardId)
      return res.status(400).json({ message: "Missing id" });

    const [liked] = await db
      .select()
      .from(likes)
      .where(and(eq(likes.user_id, userId), eq(likes.card_id, cardId)));

    if (liked) {
      await db
        .delete(likes)
        .where(and(eq(likes.user_id, userId), eq(likes.card_id, cardId)));

      return res.status(200).json({ liked: false });
    }
    await db.insert(likes).values({ user_id: userId, card_id: cardId });

    const card = await db.select().from(cards).where(eq(cards.id, cardId));
    const ownerId = card[0]?.user_id;

    if (ownerId !== userId) {
      await notificationQueue.add("notify", {
        type: "LIKE",
        userId: ownerId,
        fromUserId: userId,
        cardId,
      });
    }

    return res.status(200).json({ liked: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFollowingCards = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(400).json({ message: "Unauthorized" });

    const followingCards = await db
      .select({
        id: cards.id,
        poster: cards.poster,
        rate: cards.rate,
        review: cards.review,

        user_name: users.name,
        user_picture: users.picture,
      })
      .from(follows)
      .innerJoin(cards, eq(cards.user_id, follows.following_id))
      .innerJoin(users, eq(users.id, cards.user_id))
      .where(eq(follows.follower_id, userId))
      .orderBy(desc(cards.created_at))
      .limit(30);

    res.status(200).json(followingCards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const homePageCards = async (req: Request, res: Response) => {
  try {
    const recentCards = await db
      .select({
        id: cards.id,
        title: cards.title,
        poster: cards.poster,
        banner: cards.banner,
        release: cards.release,
        description: cards.description,
        rate: cards.rate,
        review: cards.review,
        created_at: cards.created_at,
        tmdb_id: cards.tmdb_id,

        user_name: users.name,
        user_unique_id: users.unique_id,
        user_picture: users.picture,
      })
      .from(cards)
      .innerJoin(users, eq(users.id, cards.user_id))
      .orderBy(desc(cards.created_at))
      .limit(20);

    res.status(200).json(recentCards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const movieReviews = async (req: Request, res: Response) => {
  const movieId = Number(req.params.movieId);

  if (isNaN(movieId)) {
    return res.status(400).json({ message: "Invalid tmdb_id" });
  }

  try {
    const movieReviews = await db
      .select({
        id: cards.id,
        title: cards.title,
        poster: cards.poster,
        banner: cards.banner,
        release: cards.release,
        description: cards.description,
        rate: cards.rate,
        review: cards.review,
        created_at: cards.created_at,
        tmdb_id: cards.tmdb_id,

        user_name: users.name,
        user_unique_id: users.unique_id,
        user_picture: users.picture,
      })
      .from(cards)
      .leftJoin(users, eq(users.id, cards.user_id))
      .where(eq(cards.tmdb_id, movieId))
      .orderBy(desc(cards.created_at))
      .limit(20);

    res.status(200).json(movieReviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getCardLogged = async (req: Request, res: Response) => {
  try {
    const cardId = Number(req.params.cardId);
    const userId = req.userId;

    if (!cardId) return res.status(400).json({ message: "Card id required" });
    if (!userId) return res.status(400).json({ message: "Unauthorized" });

    const [card] = await db
      .select({
        id: cards.id,
        title: cards.title,
        poster: cards.poster,
        description: cards.description,
        rate: cards.rate,
        review: cards.review,
        tmdb_id: cards.tmdb_id,
        created_at: cards.created_at,
        release: cards.release,

        user_name: users.name,
        user_unique_id: users.unique_id,
        user_picture: users.picture,

        likes_count: sql<number>`
        (
          SELECT COUNT(*)::int
          FROM likes
          WHERE likes.card_id = ${cards.id}
        )`,
        comments_count: sql<number>`
        (
          SELECT COUNT(*)
          FROM comments
          WHERE comments.card_id = ${cards.id}
        )`,
        liked_by_user: sql<boolean>`
        
          EXISTS (
            SELECT 1
            FROM likes
            WHERE likes.card_id = ${cards.id}
            AND likes.user_id = ${userId}
          )
        `,
      })
      .from(cards)
      .innerJoin(users, eq(users.id, cards.user_id))
      .where(eq(cards.id, cardId));

    res.status(200).json(card);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const commentCard = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const cardId = Number(req.params.cardId);
    const { comment } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!comment)
      return res.status(400).json({ message: "No comment to insert" });
    if (!cardId) return res.status(400).json({ message: "Card id missing" });

    // insert the comment in the db
    const newComment = await db
      .insert(comments)
      .values({ user_id: userId, card_id: cardId, comment })
      .returning({ id: comments.id });

    //get the card owner
    const card = await db.select().from(cards).where(eq(cards.id, cardId));
    const ownerId = card[0]?.user_id;
    if (ownerId !== userId) {
      await notificationQueue.add("notify", {
        type: "COMMENT",
        userId: ownerId,
        fromUserId: userId,
        cardId,
        commentId: newComment[0]?.id,
      });
    }

    res.status(201).json({ message: "Comment posted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const cardId = Number(req.params.cardId);

    if (isNaN(cardId))
      return res.status(400).json({ message: "Invalid card id" });

    const commentSection = await db
      .select({
        id: comments.id,
        comment: comments.comment,
        name: users.name,
        unique_id: users.unique_id,
        picture: users.picture,
        created_at: comments.created_at,
        likes: sql<number>`COUNT(comment_likes.comment_id)::int`,
      })
      .from(comments)
      .innerJoin(users, eq(users.id, comments.user_id))
      .leftJoin(comment_likes, eq(comment_likes.comment_id, comments.id))
      .where(eq(comments.card_id, cardId))
      .groupBy(comments.id, users.id)
      .orderBy(asc(comments.id));

    res.status(200).json({ commentSection });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const likeComment = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const commentId = Number(req.params.commId);

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (isNaN(commentId))
      return res.status(400).json({ message: "Invalid comment id" });

    const [isLiked] = await db
      .select()
      .from(comment_likes)
      .where(
        and(
          eq(comment_likes.user_id, userId),
          eq(comment_likes.comment_id, commentId),
        ),
      );

    if (isLiked) {
      await db
        .delete(comment_likes)
        .where(
          and(
            eq(comment_likes.user_id, userId),
            eq(comment_likes.comment_id, commentId),
          ),
        );

      return res.status(200).json({ message: "Like removed" });
    }

    await db
      .insert(comment_likes)
      .values({ user_id: userId, comment_id: commentId });

    res.status(201).json({ message: "Comment liked" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCommentsLogged = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const cardId = Number(req.params.cardId);

    if (isNaN(cardId))
      return res.status(400).json({ message: "Invalid card id" });
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const commentSection = await db
      .select({
        id: comments.id,
        comment: comments.comment,
        name: users.name,
        unique_id: users.unique_id,
        picture: users.picture,
        likes: sql<number>`COUNT(comment_likes.comment_id)::int`,
        isLiked: sql<boolean>`COALESCE(BOOL_OR(comment_likes.user_id = ${userId}), false)`,
        isOwner: sql<boolean>`COALESCE(BOOL_OR(comments.user_id = ${userId}), false)`,
        created_at: comments.created_at,
      })
      .from(comments)
      .innerJoin(users, eq(users.id, comments.user_id))
      .leftJoin(comment_likes, eq(comment_likes.comment_id, comments.id))
      .where(eq(comments.card_id, cardId))
      .groupBy(comments.id, users.id)
      .orderBy(asc(comments.id));

    res.status(200).json({ commentSection });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const commentId = Number(req.params.commentId);

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!commentId)
      return res.status(400).json({ message: "comment id missing" });

    const [deleted] = await db
      .delete(comments)
      .where(eq(comments.id, commentId))
      .returning();

    if (!deleted) return res.status(404).json({ message: "Comment not found" });

    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
