import { useOutletContext } from "react-router-dom";
import BackgroundImg from "./components/BackgroundImg";
import Carousel from "./components/Carousel";
import Middle from "./components/Middle";
import type { Movie } from "./components/Layout";

type LayoutContext = {
  movieName: string;
  movieImage: string;
  movieInfo: string;
  movieDescription: string;
  setMovieName: React.Dispatch<React.SetStateAction<string>>;
  setMovieImage: React.Dispatch<React.SetStateAction<string>>;
  setMovieInfo: React.Dispatch<React.SetStateAction<string>>;
  setMovieDescription: React.Dispatch<React.SetStateAction<string>>;
  movies: Movie[];
};

const App = () => {
  const {
    movieName,
    movieImage,
    movieInfo,
    movieDescription,
    setMovieName,
    setMovieImage,
    setMovieInfo,
    setMovieDescription,
    movies,
  } = useOutletContext<LayoutContext>();

  return (
    <>
      <BackgroundImg movieImage={movieImage} />
      <Middle
        movieName={movieName}
        movieDescription={movieDescription}
        movieInfo={movieInfo}
      />
      <Carousel
        setMovieName={setMovieName}
        setMovieImage={setMovieImage}
        setMovieInfo={setMovieInfo}
        setMovieDescription={setMovieDescription}
        movies={movies}
      />
    </>
  );
};

export default App;
