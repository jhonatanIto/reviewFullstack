import type { Dispatch } from "react";
import type { Movie } from "./Layout";

interface CarouselProps {
  setMovieName: Dispatch<React.SetStateAction<string>>;
  setMovieImage: Dispatch<React.SetStateAction<string>>;
  setMovieDescription: Dispatch<React.SetStateAction<string>>;
  setMovieRelease: Dispatch<React.SetStateAction<string>>;
  movies: Movie[];
}

const Carousel = ({
  setMovieDescription,
  setMovieImage,
  setMovieRelease,
  setMovieName,
  movies,
}: CarouselProps) => {
  return (
    <div className="absolute bottom-[5%] flex flex-col justify-center mt-10">
      <div className="mt-10 flex">
        {movies.map((m, index) => {
          return (
            <div
              key={index}
              className="w-[13%] ml-2.5 overflow-hidden rounded-2xl "
            >
              <img
                className="w-full cursor-pointer object-cover hover:scale-110 transition-transform duration-200 "
                src={m.poster_path}
                onClick={() => {
                  setMovieImage(m.backdrop_path);
                  setMovieName(m.original_title);
                  setMovieRelease(m.release_date);
                  setMovieDescription(m.overview);
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
