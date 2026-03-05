import type { Dispatch } from "react";
import type { Movie } from "./Layout";
import noImg from "../images/noImage.png";

interface CarouselProps {
  setMovieName: Dispatch<React.SetStateAction<string>>;
  setMovieImage: Dispatch<React.SetStateAction<string>>;
  setMoviePoster: Dispatch<React.SetStateAction<string>>;
  setMovieDescription: Dispatch<React.SetStateAction<string>>;
  setMovieRelease: Dispatch<React.SetStateAction<string>>;
  movies: Movie[];
}

const Carousel = ({
  setMovieDescription,
  setMovieImage,
  setMoviePoster,
  setMovieRelease,
  setMovieName,
  movies,
}: CarouselProps) => {
  return (
    <div className="absolute bottom-[5%] flex flex-col justify-center  mt-10">
      <div className="mt-10 flex">
        {movies.map((m, index) => {
          const imgBaseUrl = "https://image.tmdb.org/t/p";
          const convPoster = `${imgBaseUrl}/w500${m.poster_path}`;
          const convBanner = `${imgBaseUrl}/original${m.backdrop_path}`;
          return (
            <div
              key={index}
              className="w-[13%] ml-2.5 overflow-hidden rounded-2xl flex items-center"
            >
              <img
                className="w-full cursor-pointer object-cover hover:scale-110 transition-transform duration-200 text-white"
                src={m.poster_path ? convPoster : noImg}
                alt={m.original_title}
                onClick={() => {
                  setMovieImage(convBanner);
                  setMoviePoster(convPoster);
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
