import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Login from "./Login";

export interface Movie {
  original_title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  id: number;
}

const Layout = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieName, setMovieName] = useState<string>();
  const [movieImage, setMovieImage] = useState<string>();
  const [movieRelease, setMovieRelease] = useState<string>();
  const [movieDescription, setMovieDescription] = useState<string>();
  const location = useLocation();

  useEffect(() => {
    if (movies.length > 0) {
      const convBanner = `https://image.tmdb.org/t/p/original${movies[0].backdrop_path}`;
      setMovieName(movies[0].original_title);
      setMovieImage(convBanner);
      setMovieDescription(movies[0].overview);
      setMovieRelease(movies[0].release_date);
    }
  }, [movies]);

  return (
    <div className="w-full min-h-screen relative flex flex-col bg-zinc-900 z-0">
      <Header setMovies={setMovies} />

      <Outlet
        context={{
          movieName,
          movieImage,
          movieRelease,
          movieDescription,
          setMovieName,
          setMovieImage,
          setMovieRelease,
          setMovieDescription,
          movies,
        }}
      />
      {location.pathname === "/login" && <Login />}
    </div>
  );
};

export default Layout;
