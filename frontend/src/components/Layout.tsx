import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Login from "./Login";
import Modal from "./Modal";
import Loading from "./Loading";
import { ToastContainer } from "react-toastify";

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
  const [moviePoster, setMoviePoster] = useState<string>();
  const [movieRelease, setMovieRelease] = useState<string>();
  const [movieDescription, setMovieDescription] = useState<string>();

  const [modal, setModal] = useState<boolean>(false);
  const [startIndex, setStartIndex] = useState(0);
  const location = useLocation();

  useEffect(() => {
    if (movies.length > 0) {
      const convBanner = `https://image.tmdb.org/t/p/original${movies[0].backdrop_path}`;
      const convPoster = `https://image.tmdb.org/t/p/w500${movies[0].poster_path}`;
      setMovieName(movies[0].original_title);
      setMovieImage(convBanner);
      setMoviePoster(convPoster);
      setMovieDescription(movies[0].overview);
      setMovieRelease(movies[0].release_date);
    }
  }, [movies]);

  return (
    <div className="w-full min-h-screen relative flex flex-col bg-zinc-900 z-0">
      <Header setMovies={setMovies} setStartIndex={setStartIndex} />

      <Outlet
        context={{
          movies,
          movieName,
          movieImage,
          movieRelease,
          movieDescription,
          startIndex,
          setMovieName,
          setMovieImage,
          setMoviePoster,
          setMovieRelease,
          setMovieDescription,
          setModal,
          setStartIndex,
        }}
      />
      <Modal
        modal={modal}
        setModal={setModal}
        moviePoster={moviePoster}
        movieImage={movieImage}
        movieName={movieName}
        movieDescription={movieDescription}
        movieRelease={movieRelease}
      />
      {location.pathname === "/login" && <Login />}
      <Loading />
      <ToastContainer />
    </div>
  );
};

export default Layout;
