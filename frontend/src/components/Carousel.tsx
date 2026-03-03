import type { Dispatch } from "react";
import click from "../images/click.jpg";
import type { Movie } from "../App";

interface CarouselProps {
  setMovieName: Dispatch<React.SetStateAction<string>>;
  setMovieImage: Dispatch<React.SetStateAction<string>>;
  setMovieDescription: Dispatch<React.SetStateAction<string>>;
  setMovieInfo: Dispatch<React.SetStateAction<string>>;
  movies: Movie[];
}

const Carousel = ({
  setMovieDescription,
  setMovieImage,
  setMovieInfo,
  setMovieName,
  movies,
}: CarouselProps) => {
  const selectMovie = () => {};

  return (
    <div className="absolute bottom-[10%] flex flex-col justify-center mt-10">
      <div className="text-white ml-30 text-2xl ">Recent Releases</div>
      <div className="mt-10 flex">
        {movies.map((m, index) => {
          const poster = m.Poster.replace("SX300", "SX1000");

          return (
            <div
              key={index}
              className="w-[13%] ml-2.5 overflow-hidden rounded-2xl "
            >
              <img
                className="w-full cursor-pointer object-cover hover:scale-110 transition-transform duration-200"
                src={poster}
                onClick={() => {
                  setMovieImage(poster);
                  setMovieName(m.Title);
                  setMovieInfo(m.Year);
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Carousel;
