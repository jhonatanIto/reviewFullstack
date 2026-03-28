import { IoAddOutline } from "react-icons/io5";
import { useUser } from "../context/useUser";
import useNotification from "../hooks/useNotification";
import { useMovie } from "../context/useMovie";
import { PiTrashLight } from "react-icons/pi";
import { backend, deleteWatchCard, homePageCards } from "../utils/fetchData";
import userpic from "../images/user.png";
import noImg from "../images/noImage.png";
import { IoStar } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import type { Cards } from "../context/UserContext";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useCallback, useEffect, useRef, useState } from "react";

interface Middle {
  feedCards: Cards[];
  setFeedCards: React.Dispatch<React.SetStateAction<Cards[]>>;
}

const Middle = ({ feedCards, setFeedCards }: Middle) => {
  const { token } = useUser();
  const { errorNotification, successNotification } = useNotification();
  const [page, setPage] = useState(1);
  const [loadingPage, setLoadingPage] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const firstLoad = useRef(true);

  const {
    movies,
    movieName,
    movieRelease,
    movieDescription,
    moviePoster,
    movieImage,
    movieId,
    setMovieImage,
    setMovieDescription,
    setMovieName,
    setMoviePoster,
    setMovieRelease,
    setMovieId,
    setModal,
  } = useMovie();

  const { watchlist, loadCards, setLoading } = useUser();

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const postWatchlist = async () => {
    if (!token) return errorNotification("Sign in to save movies");

    const body = {
      title: movieName,
      release: movieRelease,
      description: movieDescription,
      poster: moviePoster,
      banner: movieImage,
      tmdb_id: movieId,
    };
    try {
      const res = await fetch(`${backend}/api/watchlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data?.message);
        return errorNotification("Couldn't add movie");
      }

      successNotification("Movie added!");
      console.log(data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const inWatchlist = watchlist.some((w) => w.tmdb_id === movieId);

  const removeWatchlist = async () => {
    const currentCard = watchlist.find((w) => w.tmdb_id === movieId);
    if (!currentCard?.id) return;
    try {
      setLoading(true);
      deleteWatchCard(token, currentCard.id);
      loadCards();
      successNotification("Removed from watchlist");
    } catch (error) {
      console.error(error);
      errorNotification("Couldn't remove");
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const getFeed = async () => {
    const data = await homePageCards(1);
    setFeedCards(data || []);
  };

  const loadMore = useCallback(async () => {
    if (currentReviews.current !== 0) return;
    if (loadingPage || !hasMore) return;

    setLoadingPage(true);

    const nextPage = page + 1;
    const data = await homePageCards(nextPage);

    if (data.length === 0) {
      setHasMore(false);
    } else {
      setFeedCards((prev) => [...prev, ...data]);
      setPage(nextPage);
    }

    setLoadingPage(false);
  }, [page, loadingPage, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (firstLoad.current) {
          firstLoad.current = false;
          return;
        }
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      {
        rootMargin: "200px",
      },
    );

    const current = loaderRef.current;

    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [loadMore]);

  useEffect(() => {
    getFeed();
    setHasMore(true);
  }, []);

  const currentReviews = useRef(0);

  const displayReviews = async () => {
    if (!movieId) return;
    try {
      const res = await fetch(`${backend}/api/cards/movieReviews/${movieId}`);
      const data = await res.json();
      if (!res.ok) return console.log(data?.message);

      currentReviews.current = movieId;
      setFeedCards(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="text-white px-[5%]  mt-8 md:mt-10 flex flex-col md:flex-row justify-between ">
      <div className="w-full md:w-auto ">
        <div className="text-[clamp(26px,4vw,40px)] xl:text-[clamp(40px,4vw,65px)] font-bold leading-tight">
          {movieName}
        </div>
        <div className="text-lg md:text-2xl opacity-70">{movieRelease}</div>

        <div
          className="mt-6 md:mt-10 max-h-40 md:max-h-[35%] overflow-y-auto 
      text-[clamp(16px,1.5vw,22px)] w-full md:max-w-2xl"
        >
          {movieDescription}
        </div>

        <div className="flex flex-col sm:flex-row mt-8 md:mt-10 items-start sm:items-center gap-4">
          <button
            className="w-full sm:w-auto bg-linear-to-l from-purple-600 to-purple-700 py-2 px-6 cursor-pointer duration-200 z-20
            text-[18px] md:text-[20px] rounded-[10px] text-white  hover:text-white hover:from-purple-500 transition-all"
            onClick={() => setModal(true)}
          >
            Create Review
          </button>
          <button
            className="w-full sm:w-auto  bg-linear-to-l from-purple-600 to-purple-800 py-2 px-6 cursor-pointer duration-200 z-20 md:min-w-25
            text-[18px] md:text-[20px] rounded-[10px] text-white  hover:text-white hover:from-purple-500 transition-all"
            onClick={() => {
              if (currentReviews.current === movieId) {
                currentReviews.current = 0;
                setPage(1);
                setHasMore(true);
                getFeed();
              } else {
                displayReviews();
              }
            }}
          >
            {currentReviews.current === movieId ? "Feed" : "All Reviews"}
          </button>

          <button
            className="w-full sm:w-auto flex justify-center text-zinc-500 hover:text-zinc-100 items-center border p-2 cursor-pointer px-6
          rounded-[10px] text-[18px] md:text-[20px] transition-all duration-200 z-20"
            onClick={() => {
              if (!inWatchlist) {
                postWatchlist();
                loadCards();
              } else {
                removeWatchlist();
              }
            }}
          >
            {inWatchlist ? (
              <PiTrashLight />
            ) : (
              <IoAddOutline className="text-2xl" />
            )}
            <span className="ml-3">
              {inWatchlist ? "Remove from watchlist" : "Watch list"}
            </span>
          </button>
        </div>
      </div>

      <div className="md:absolute  w-full left-0 bottom-[2%] flex flex-col justify-center select-none z-10  overflow-hidden">
        <div
          ref={sliderRef}
          className="mt-10 flex justify-start  overflow-x-scroll no-scrollbarChat  cursor-grab active:cursor-grabbing select-none   
         [&>button]:bg-zinc-800/40  [&>button]:h-full [&>button]:text-white [&>button]:z-10 [&>button]:text-[50px] "
          onWheel={(e) => {
            e.currentTarget.scrollLeft += e.deltaY;
          }}
          onMouseDown={(e) => {
            if (!sliderRef.current) return;
            isDragging.current = true;
            startX.current = e.pageX - sliderRef.current.offsetLeft;
            scrollLeft.current = sliderRef.current.scrollLeft;
          }}
          onMouseLeave={() => (isDragging.current = false)}
          onMouseUp={() => (isDragging.current = false)}
          onMouseMove={(e) => {
            if (!isDragging.current || !sliderRef.current) return;

            e.preventDefault();

            const x = e.pageX - sliderRef.current.offsetLeft;
            const walk = (x - startX.current) * 1.5;

            sliderRef.current.scrollLeft = scrollLeft.current - walk;
          }}
        >
          <button className=" -left-1.5 absolute items-center  md:flex hidden   ml-1.5 ">
            <IoIosArrowBack className="mb-8" />
          </button>
          {movies.map((m) => {
            const imgBaseUrl = "https://image.tmdb.org/t/p";
            const convPoster = `${imgBaseUrl}/w500${m.poster_path}`;
            const convBanner = `${imgBaseUrl}/original${m.backdrop_path}`;
            return (
              <div
                key={m.id}
                className="w-[20%] md:w-[9.5%] shrink-0 ml-1 mr-1 overflow-hidden rounded-2xl flex items-center select-none"
              >
                <img
                  draggable={false}
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
          <button className="-right-2 absolute items-center  md:flex hidden mr-1.5">
            <IoIosArrowForward className="mb-8" />
          </button>
        </div>
      </div>

      <div
        className="w-full md:w-[37%] h-100 md:h-[51vh] mt-4 md:mr-[1%] rounded-2xl p-1 
      overflow-y-auto no-scrollbar "
      >
        {feedCards?.map((c) => {
          return (
            <div
              key={c.id}
              className="border border-white/20 rounded-2xl flex p-2 items-center backdrop-blur-[70px] 
            shadow-[0_4px_20px_rgba(0,0,0,0.25)] mt-3 select-none"
            >
              <div className="flex flex-col items-center ml-2 group shrink-0 relative ">
                <div className="overflow-hidden rounded-full">
                  <img
                    src={c.user_picture ?? userpic}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover cursor-pointer group-hover:scale-110 
                  bg-zinc-600 duration-200 transition-all"
                    onClick={() => navigate(`/profile/${c.user_unique_id}`)}
                  />
                </div>
              </div>

              <div className="ml-3 text-[16px] md:text-[18px]">
                <div className="text-xs md:text-sm font-semibold group-hover:text-purple-500 transition-all duration-200 cursor-pointer mb-1">
                  {c.user_name}
                </div>
                <div className="flex items-center">
                  <span className="hidden sm:inline">Rated:</span>
                  <span className="text-amber-600 flex items-center sm:ml-2">
                    {c?.rate} <IoStar className="text-[14px] ml-1" />
                  </span>
                </div>

                <button
                  className="border rounded-2xl px-3 py-0.5 mt-2 text-sm md:text-base cursor-pointer hover:bg-purple-500 hover:border-white/0 transition-all duration-200"
                  onClick={() => navigate(`/${c.user_unique_id}/${c.id}`)}
                >
                  Review
                </button>
              </div>

              <div
                className="ml-auto flex items-center border border-white/20 rounded-2xl p-1 pl-2 cursor-pointer
              duration-200 transition-all hover:border-purple-500 max-w-[40%] sm:max-w-none"
                onClick={() => {
                  setMovieImage(c.banner);
                  setMovieDescription(c.description);
                  setMovieName(c.title);
                  setMoviePoster(c.poster);
                  setMovieRelease(c.release);
                  setMovieId(c.tmdb_id);
                }}
              >
                <div className="mr-2 md:mr-4 text-[14px] md:text-[20px] text-right line-clamp-2">
                  {c.title}
                </div>
                <img
                  src={c.poster}
                  className="h-12 md:h-20 rounded-lg md:rounded-2xl shrink-0"
                />
              </div>
            </div>
          );
        })}
        <div ref={loaderRef}>{loadingPage && <p></p>}</div>
      </div>
    </div>
  );
};

export default Middle;
