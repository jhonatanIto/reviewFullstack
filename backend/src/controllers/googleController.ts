import type { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { db } from "../db/db.js";
import { follows, users } from "../db/schema.js";
import { count, eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { googleToken } = req.body;

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      throw new Error("GOOGLE_CLIENT_ID not defined");
    }

    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: clientId,
    });

    const payload = ticket.getPayload();
    if (!payload)
      return res.status(400).json({ message: "Invalid Google token" });

    const { email, name, picture, sub } = payload;

    if (!email || !sub)
      return res.status(400).json({ message: "Invalid Google payload" });

    let [googleUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (googleUser) {
      if (!googleUser.googleId) {
        await db
          .update(users)
          .set({ googleId: sub })
          .where(eq(users.id, googleUser.id));

        googleUser.googleId = sub;
      }
    }

    if (!googleUser) {
      [googleUser] = await db
        .insert(users)
        .values({
          email,
          name: name ?? "",
          googleId: sub,
          picture: picture ?? "",
          unique_id: nanoid(10),
        })
        .returning();
    }
    if (!googleUser)
      return res
        .status(500)
        .json({ message: "Failed to create or fetch user" });

    if (googleUser && !googleUser.googleId) {
      await db
        .update(users)
        .set({ googleId: sub })
        .where(eq(users.id, googleUser.id));

      googleUser.googleId = sub;
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET not defined");
    }

    const [followingCount] = await db
      .select({ total: count() })
      .from(follows)
      .where(eq(follows.follower_id, googleUser.id));

    const [followersCount] = await db
      .select({ total: count() })
      .from(follows)
      .where(eq(follows.following_id, googleUser.id));

    const appToken = jwt.sign({ id: googleUser.id }, jwtSecret, {
      expiresIn: "7d",
    });

    res.json({
      token: appToken,
      user: {
        id: googleUser.id,
        name: googleUser.name,
        email: googleUser.email,
        picture: googleUser.picture,
        unique_id: googleUser.unique_id,
        following: followingCount?.total ?? 0,
        followers: followersCount?.total ?? 0,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Google authentication failed" });
  }
};
