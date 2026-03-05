import type { Request, Response } from "express";
import { db } from "../db/db.js";
import { cards } from "../db/schema.js";
import { eq, type InferInsertModel } from "drizzle-orm";
type NewCard = InferInsertModel<typeof cards>;

export const postCard = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { title, release, description, poster, rate, review } = req.body;

    if (!title || !rate || !poster || !release || !description) {
      return res.status(400).json({ message: "Missing fields" });
    }
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const movie: NewCard = {
      title,
      release,
      description,
      poster,
      rate,
      review: review ? review : null,
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

    if (userCards.length === 0)
      return res.status(404).json({ message: "cards not found" });

    res.status(200).json(userCards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
