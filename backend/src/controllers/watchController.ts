import type { Request, Response } from "express";
import { db } from "../db/db.js";
import { watchlist } from "../db/schema.js";
import { and, eq, type InferInsertModel } from "drizzle-orm";
type NewCard = InferInsertModel<typeof watchlist>;

export const postWatch = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { title, release, description, poster, banner } = req.body;

    if (!title || !poster || !release || !description) {
      return res.status(400).json({ message: "Missing fields" });
    }
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const movie: NewCard = {
      title,
      release,
      description,
      poster,
      banner: banner ? banner : null,
      user_id: userId,
    };

    await db.insert(watchlist).values(movie);

    res.status(201).json({ message: "Card created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getWatch = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const userCards = await db
      .select()
      .from(watchlist)
      .where(eq(watchlist.user_id, userId));

    if (userCards.length === 0)
      return res.status(404).json({ message: "cards not found" });

    res.status(200).json(userCards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteWatch = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { cardId } = req.params;

    if (!userId) return;
    if (!cardId) return;

    const [deletedCard] = await db
      .delete(watchlist)
      .where(
        and(eq(watchlist.user_id, userId), eq(watchlist.id, Number(cardId))),
      )
      .returning();

    if (!deletedCard)
      return res.status(404).json({ message: "Card not found" });

    res.status(200).json({ message: "Card deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
