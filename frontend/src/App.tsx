import { useOutletContext } from "react-router-dom";
import BackgroundImg from "./components/BackgroundImg";
import Carousel from "./components/Carousel";
import Middle from "./components/Middle";
import type { Movie } from "./components/Layout";

type LayoutContext = {
  movieName: string;
  movieImage: string;
  movieRelease: string;
  movieDescription: string;
  setMovieName: React.Dispatch<React.SetStateAction<string>>;
  setMovieImage: React.Dispatch<React.SetStateAction<string>>;
  setMovieRelease: React.Dispatch<React.SetStateAction<string>>;
  setMovieDescription: React.Dispatch<React.SetStateAction<string>>;
  movies: Movie[];
};

const App = () => {
  const {
    movieName,
    movieImage,
    movieRelease,
    movieDescription,
    setMovieName,
    setMovieImage,
    setMovieRelease,
    setMovieDescription,
    movies,
  } = useOutletContext<LayoutContext>();

  return (
    <>
      <BackgroundImg movieImage={movieImage} />
      <Middle
        movieName={movieName}
        movieDescription={movieDescription}
        movieRelease={movieRelease}
      />
      <Carousel
        setMovieName={setMovieName}
        setMovieImage={setMovieImage}
        setMovieRelease={setMovieRelease}
        setMovieDescription={setMovieDescription}
        movies={movies}
      />
    </>
  );
};

export default App;
