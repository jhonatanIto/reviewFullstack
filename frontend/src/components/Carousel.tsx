import noImg from "../images/noImage.png";

import { useMovie } from "../context/useMovie";

const Carousel = () => {
  const {
    movies,
    setMovieImage,
    setMovieDescription,
    setMovieName,
    setMoviePoster,
    setMovieRelease,
    setMovieId,
  } = useMovie();

  return (
    <div className="md:absolute relative  w-full bottom-[2%] flex flex-col justify-center select-none   overflow-hidden">
      <div
        className="mt-10 flex justify-start  overflow-x-scroll no-scrollbar"
        onWheel={(e) => {
          e.currentTarget.scrollLeft += e.deltaY;
        }}
      >
        {movies.map((m, index) => {
          const imgBaseUrl = "https://image.tmdb.org/t/p";
          const convPoster = `${imgBaseUrl}/w500${m.poster_path}`;
          const convBanner = `${imgBaseUrl}/original${m.backdrop_path}`;
          return (
            <div
              key={index}
              className="w-[20%] md:w-[9.5%] shrink-0 ml-1 mr-1 overflow-hidden rounded-2xl flex items-center"
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
                  setMovieId(m.id);
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
