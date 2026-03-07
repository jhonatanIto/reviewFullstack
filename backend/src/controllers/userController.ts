import type { Request, Response } from "express";

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const {} = req.body;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
