import type { Request, Response } from "express";

const tmdbKey = process.env.TMDB_API_KEY;
let cache: any = null;
let lastFetch = 0;

export const homePageMovies = async (req: Request, res: Response) => {
  try {
    if (!tmdbKey) {
      return res.status(500).json({ message: "Missing TMDB API key" });
    }
    const now = Date.now();
    if (cache && now - lastFetch < 60000) {
      return res.json(cache);
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${tmdbKey}`,
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ message: "Error fetching from TMDB" });
    }

    const data = await response.json();

    cache = data;
    lastFetch = now;

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
