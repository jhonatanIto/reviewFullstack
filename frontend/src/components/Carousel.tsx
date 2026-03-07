import { type Dispatch } from "react";

import noImg from "../images/noImage.png";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { useMovie } from "../context/useMovie";

interface CarouselProps {
  startIndex: number;
  setStartIndex: Dispatch<React.SetStateAction<number>>;
}

const Carousel = ({ setStartIndex, startIndex }: CarouselProps) => {
  const {
    movies,
    setMovieImage,
    setMovieDescription,
    setMovieName,
    setMoviePoster,
    setMovieRelease,
  } = useMovie();

  const visibleMovies = movies.slice(startIndex, startIndex + 10);

  const next = () => {
    if (startIndex + 10 < movies.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const prev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  return (
    <div className="absolute bottom-[5%] flex flex-col justify-center select-none mt-10">
      <div
        className="mt-10 flex relative [&>button]:absolute  [&>button]:text-[50px]  [&>button]:bg-zinc-800/40  [&>button]:h-full
       [&>button]:cursor-pointer  [&>button]:text-white [&>button]:z-10 [&>button]:hover:bg-zinc-200/40"
      >
        <button className=" -left-0.5 rounded-l-2xl ml-1.5" onClick={prev}>
          <IoIosArrowBack />
        </button>
        {visibleMovies.map((m, index) => {
          const imgBaseUrl = "https://image.tmdb.org/t/p";
          const convPoster = `${imgBaseUrl}/w500${m.poster_path}`;
          const convBanner = `${imgBaseUrl}/original${m.backdrop_path}`;
          return (
            <div
              key={index}
              className="w-[13%] ml-1 mr-1 overflow-hidden rounded-2xl flex items-center"
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
        <button className=" -right-0.5 rounded-r-2xl mr-1.5" onClick={next}>
          <IoIosArrowForward />
        </button>
      </div>
    </div>
  );
};

export default Carousel;
