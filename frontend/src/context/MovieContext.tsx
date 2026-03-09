import { createContext } from "react";

export interface Movie {
  original_title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  id: number;
}

interface MovieContextType {
  movies: Movie[];
  movieName: string;
  movieImage: string;
  moviePoster: string;
  movieRelease: string;
  movieDescription: string;
  modal: boolean;
  movieId: number;
  setMovieId: React.Dispatch<React.SetStateAction<number>>;
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
  setMovieName: React.Dispatch<React.SetStateAction<string>>;
  setMovieImage: React.Dispatch<React.SetStateAction<string>>;
  setMoviePoster: React.Dispatch<React.SetStateAction<string>>;
  setMovieRelease: React.Dispatch<React.SetStateAction<string>>;
  setMovieDescription: React.Dispatch<React.SetStateAction<string>>;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MovieContext = createContext<MovieContextType | undefined>(
  undefined,
);
