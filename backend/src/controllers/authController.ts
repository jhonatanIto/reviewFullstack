import type { Request, Response } from "express";
import { db } from "../db/db.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const lowerCaseEmail = email.toLowerCase();

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, lowerCaseEmail));

    if (existingUser)
      return res.status(409).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email: lowerCaseEmail,
        password: hashedPassword,
        unique_id: nanoid(10),
      })
      .returning();

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) throw new Error("JWT_SECRET not defined");

    const token = jwt.sign(
      { id: newUser?.id, email: newUser?.email },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(201).json({
      token,
      user: {
        id: newUser?.id,
        name: newUser?.name,
        email: newUser?.email,
        unique_id: newUser?.unique_id,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) return res.status(404).json({ message: "Invalid credentials" });

    if (!user.password)
      return res
        .status(400)
        .json({ message: "Login with google for this account" });

    const authorized = await bcrypt.compare(password, user.password);

    if (!authorized)
      return res.status(401).json({ message: "Invalid credentials" });

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) throw new Error("JWT_SECRET not defined");

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        unique_id: user.unique_id,
        following: user.following,
        followers: user.followers,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
