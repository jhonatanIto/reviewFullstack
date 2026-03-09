import type { Request, Response } from "express";
import { db } from "../db/db.js";
import { cards } from "../db/schema.js";
import { and, eq, type InferInsertModel } from "drizzle-orm";
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
      .select()
      .from(cards)
      .where(eq(cards.user_id, userId));

    res.status(200).json(userCards);
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
