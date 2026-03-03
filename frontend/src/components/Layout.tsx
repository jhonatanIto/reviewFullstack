import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import spider from "../images/spider.jpg";

export interface Movie {
  Poster: string;
  Title: string;
  Type: string;
  Year: string;
  imdbID: string;
}

const Layout = () => {
  const [movieName, setMovieName] = useState("Spider man 2");
  const [movieImage, setMovieImage] = useState(spider);
  const [movieInfo, setMovieInfo] = useState(
    "2004 | 1hour 55 minutes | Sci-fi",
  );
  const [movieDescription, setMovieDescription] = useState(
    "Peter Parker is beset with troubles in his failing personal life as he battles a former brilliant scientist named Otto Octavius",
  );
  const [movies, setMovies] = useState<Movie[]>([]);

  return (
    <div className="w-full min-h-screen relative flex flex-col">
      <Header setMovies={setMovies} />

      <Outlet
        context={{
          movieName,
          movieImage,
          movieInfo,
          movieDescription,
          setMovieName,
          setMovieImage,
          setMovieInfo,
          setMovieDescription,
          movies,
        }}
      />
    </div>
  );
};

export default Layout;
