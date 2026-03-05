import { useOutletContext } from "react-router-dom";
import BackgroundImg from "./components/BackgroundImg";
import Carousel from "./components/Carousel";
import Middle from "./components/Middle";
import type { Movie } from "./components/Layout";
import type { Dispatch } from "react";

type LayoutContext = {
  movies: Movie[];
  movieName: string;
  movieImage: string;
  movieRelease: string;
  movieDescription: string;
  modal: boolean;
  setMovieName: Dispatch<React.SetStateAction<string>>;
  setMovieImage: Dispatch<React.SetStateAction<string>>;
  setMoviePoster: Dispatch<React.SetStateAction<string>>;
  setMovieRelease: Dispatch<React.SetStateAction<string>>;
  setMovieDescription: Dispatch<React.SetStateAction<string>>;
  setModal: Dispatch<React.SetStateAction<boolean>>;
};

const App = () => {
  const {
    movies,
    movieName,
    movieImage,
    movieRelease,
    movieDescription,
    setMovieName,
    setMovieImage,
    setMoviePoster,
    setMovieRelease,
    setMovieDescription,
    setModal,
  } = useOutletContext<LayoutContext>();

  return (
    <>
      <BackgroundImg movieImage={movieImage} />
      <Middle
        movieName={movieName}
        movieDescription={movieDescription}
        movieRelease={movieRelease}
        setModal={setModal}
      />
      <Carousel
        setMovieName={setMovieName}
        setMovieImage={setMovieImage}
        setMoviePoster={setMoviePoster}
        setMovieRelease={setMovieRelease}
        setMovieDescription={setMovieDescription}
        movies={movies}
      />
    </>
  );
};

export default App;
