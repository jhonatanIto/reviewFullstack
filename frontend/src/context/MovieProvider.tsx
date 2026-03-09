import { useEffect, useState, type ReactNode } from "react";
import { MovieContext, type Movie } from "./MovieContext";

interface Props {
  children: ReactNode;
}

const MovieProvider = ({ children }: Props) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieName, setMovieName] = useState<string>("");
  const [movieImage, setMovieImage] = useState<string>("");
  const [moviePoster, setMoviePoster] = useState<string>("");
  const [movieRelease, setMovieRelease] = useState<string>("");
  const [movieDescription, setMovieDescription] = useState<string>("");
  const [movieId, setMovieId] = useState<number>(0);
  const [modal, setModal] = useState<boolean>(false);

  useEffect(() => {
    if (movies.length > 0) {
      const convBanner = `https://image.tmdb.org/t/p/original${movies[0].backdrop_path}`;
      const convPoster = `https://image.tmdb.org/t/p/w500${movies[0].poster_path}`;
      setMovieName(movies[0].original_title);
      setMovieImage(convBanner);
      setMoviePoster(convPoster);
      setMovieDescription(movies[0].overview);
      setMovieRelease(movies[0].release_date);
      setMovieId(movies[0].id);
    }
  }, [movies]);

  return (
    <MovieContext.Provider
      value={{
        movies,
        movieName,
        movieImage,
        moviePoster,
        movieRelease,
        movieDescription,
        modal,
        movieId,
        setMovieId,
        setMovies,
        setMovieName,
        setMovieImage,
        setMoviePoster,
        setMovieRelease,
        setMovieDescription,
        setModal,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export default MovieProvider;
