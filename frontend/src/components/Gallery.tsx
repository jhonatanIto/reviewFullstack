import { Link, Outlet } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { useUser } from "../context/useUser";
import useRate from "../hooks/useRate";
import { IoStar } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";

type SortOption =
  | "Newest"
  | "Oldest"
  | "Highest rate"
  | "Lowest rate"
  | "Release date";

const Gallery = () => {
  const { cards } = useUser();
  const { setRate } = useRate();
  const [sortBy, setSortBy] = useState<SortOption>(
    () => (localStorage.getItem("MyReview_sortBy") as SortOption) || "Newest",
  );
  const [displayFilter, setDisplayFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

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

  const sortedCards = [...(cards || [])].sort((a, b) => {
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
        return b.rate - a.rate;
      case "Lowest rate":
        return a.rate - b.rate;

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
      <div className="ml-[7%] mt-5 select-none" ref={filterRef}>
        <div
          className="bg-zinc-200/90 w-fit text-black pl-2 pr-2 font-semibold rounded-[5px]
        text-[18px] flex justify-center items-center cursor-pointer"
          onClick={() => setDisplayFilter(true)}
        >
          {sortBy} <IoIosArrowDown className="ml-3" />
        </div>
        <ul
          className={`${displayFilter ? "flex" : "hidden"}  flex-col absolute z-50 bg-zinc-100 rounded-[5px] mt-1
          w-50 text-[18px] [&>li]:p-2 [&>li]:hover:bg-zinc-200 [&>li]:cursor-pointer [&>li]:pl-4 [&>li]:hover:text-purple-900`}
        >
          <li onClick={() => selectFilter("Newest")}>Newest</li>
          <li onClick={() => selectFilter("Oldest")}>Oldest</li>
          <li onClick={() => selectFilter("Highest rate")}>Highest rate</li>
          <li onClick={() => selectFilter("Lowest rate")}>Lowest rate</li>
          <li onClick={() => selectFilter("Release date")}>Release date</li>
        </ul>
      </div>
      <div className="flex flex-wrap mx-auto max-w-[95%] justify-center">
        {sortedCards?.map((c) => {
          return (
            <Link to={`/gallery/${c.id}`}>
              <div
                key={c.id}
                className="w-60 mt-5  ml-2 mr-2 overflow-hidden relative  group cursor-pointer select-none"
              >
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

                <img
                  className="group-hover:scale-110 transition-transform duration-200 "
                  src={c.poster}
                />
              </div>
            </Link>
          );
        })}
      </div>
      <Outlet />
    </div>
  );
};

export default Gallery;
