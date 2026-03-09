import { Link, Outlet } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { useUser } from "../context/useUser";
import { IoStar } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { useMovie } from "../context/useMovie";

type SortOption =
  | "Newest"
  | "Oldest"
  | "Highest rate"
  | "Lowest rate"
  | "Release date";

const Gallery = () => {
  const { cards, watchlist, showWatch } = useUser();

  const [sortBy, setSortBy] = useState<SortOption>(
    () => (localStorage.getItem("MyReview_sortBy") as SortOption) || "Newest",
  );
  const [displayFilter, setDisplayFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const owner = true;
  const {
    setMovieName,
    setMovieDescription,
    setMovieImage,
    setMovieRelease,
    setModal,
    setMoviePoster,
    setMovieId,
  } = useMovie();

  useEffect(() => {
    const closeFilter = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setDisplayFilter(false);
      }
    };

    window.addEventListener("mousedown", closeFilter);
    return () => window.removeEventListener("mousedown", closeFilter);
  }, []);

  const selectFilter = (value: string) => {
    setDisplayFilter(false);
    setSortBy(value);
  };

  const currentArray = showWatch ? watchlist : cards;

  const linkUrl = (id: number) => {
    if (!showWatch) {
      return `/reviews/${id}`;
    } else {
      return "/";
    }
  };

  const sortedCards = [...(currentArray || [])].sort((a, b) => {
    switch (sortBy) {
      case "Newest":
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "Oldest":
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      case "Highest rate":
        return (b.rate ?? 0) - (a.rate ?? 0);
      case "Lowest rate":
        return (a.rate ?? 0) - (b.rate ?? 0);

      case "Release date":
        return new Date(b.release).getTime() - new Date(a.release).getTime();

      default:
        return 0;
    }
  });

  useEffect(() => {
    localStorage.setItem("MyReview_sortBy", sortBy);
  }, [sortBy]);

  return (
    <div className=" w-full ">
      <div className="ml-[7%] mt-5 select-none  w-fit" ref={filterRef}>
        <div
          className="bg-zinc-200/90 w-fit text-black pl-2 pr-2 font-semibold rounded-[5px]
        text-[18px] flex justify-center items-center cursor-pointer "
          onClick={() => {
            setDisplayFilter((prev) => !prev);
          }}
        >
          {sortBy} <IoIosArrowDown className="ml-3 " />
        </div>
        <ul
          className={`${displayFilter ? "flex" : "hidden"}  flex-col absolute z-50 bg-zinc-100 rounded-[5px] mt-1
          w-50 text-[18px] [&>li]:p-2 [&>li]:hover:bg-zinc-200 [&>li]:cursor-pointer [&>li]:pl-4 [&>li]:hover:text-purple-900`}
        >
          <li onClick={() => selectFilter("Newest")}>Newest</li>
          <li onClick={() => selectFilter("Oldest")}>Oldest</li>
          {!showWatch && (
            <li onClick={() => selectFilter("Highest rate")}>Highest rate</li>
          )}
          {!showWatch && (
            <li onClick={() => selectFilter("Lowest rate")}>Lowest rate</li>
          )}

          <li onClick={() => selectFilter("Release date")}>Release date</li>
        </ul>
      </div>
      <div className="flex flex-wrap mx-auto max-w-[95%] justify-center">
        {sortedCards?.map((c) => {
          return (
            <Link to={linkUrl(c.id)}>
              <div
                key={c.id}
                className="w-60 mt-5  ml-5 mr-5 overflow-hidden relative  group cursor-pointer select-none
                  shadow-black/60 shadow-[15px_0_15px_rgba(0,0,0,0.6)] "
                onClick={() => {
                  if (showWatch) {
                    setMovieDescription(c.description);
                    setMovieRelease(c.release);
                    setMovieName(c.title);
                    setMoviePoster(c.poster);
                    setMovieId(c.tmdb_id);
                    setModal(true);
                    if (c.banner) setMovieImage(c.banner);
                  }
                }}
              >
                {!showWatch && (
                  <div
                    className="opacity-0 w-full group-hover:opacity-100 transition-opacity 
               duration-200 absolute inset-0 bg-black/70 z-10 flex items-center flex-col backdrop-blur-[3px] "
                  >
                    <div className="text-2xl text-center flex items-center justify-center mt-5 text-amber-600">
                      <IoStar />
                      <div className="ml-1">{c.rate}</div>
                    </div>
                    <div className="text-white text-[20px] mt-[7%] text-center">
                      {c.review}
                    </div>
                  </div>
                )}

                <img
                  className="group-hover:scale-110 transition-transform duration-200 "
                  src={c.poster}
                />
              </div>
            </Link>
          );
        })}
      </div>
      <Outlet context={{ cards, owner }} />
    </div>
  );
};

export default Gallery;
