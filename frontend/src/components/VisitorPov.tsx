import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import { fetchProfile, toggleFollow } from "../utils/fetchData";
import naruto from "../images/naruto.jpg";
import { IoStar } from "react-icons/io5";
import type { Cards } from "../context/UserContext";
import { useUser } from "../context/useUser";
import type { SortOption } from "./Gallery";
import { IoIosArrowDown } from "react-icons/io";

const VisitorPov = () => {
  const [name, setName] = useState("");
  const [picture, setPicture] = useState("");
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const owner = false;

  const [cards, setCards] = useState<Cards[]>([]);
  const unique_id = useParams().unique as string;
  const { token } = useUser();

  const [displayFilter, setDisplayFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [sortBy, setSortBy] = useState<SortOption>(
    () => (localStorage.getItem("MyReview_sortBy") as SortOption) || "Newest",
  );
  const selectFilter = (value: string) => {
    setDisplayFilter(false);
    setSortBy(value);
  };
  useEffect(() => {
    const closeFilter = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setDisplayFilter(false);
      }
    };

    window.addEventListener("mousedown", closeFilter);
    return () => window.removeEventListener("mousedown", closeFilter);
  }, []);

  const getProfile = async () => {
    if (!unique_id || !token) return;
    try {
      const data = await fetchProfile(unique_id, token);

      setName(data.user.name);
      setPicture(data.user.picture);
      setFollowers(data.stats.followers);
      setFollowing(data.stats.following);
      setIsFollowing(data.isFollowing);
      setCards(data.cards);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getProfile();
  }, [unique_id, token]);

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
        return (b.rate ?? 0) - (a.rate ?? 0);
      case "Lowest rate":
        return (a.rate ?? 0) - (b.rate ?? 0);

      case "Release date":
        return new Date(b.release).getTime() - new Date(a.release).getTime();

      default:
        return 0;
    }
  });

  return (
    <div className="mt-10 ">
      <div className="flex text-white flex-col pl-[8%] pr-[8%]">
        <div className=" flex items-center  ">
          <img
            src={naruto}
            className="w-35 h-35 rounded-full object-cover cursor-pointer"
          />
          <div className=" ml-6 flex flex-col ">
            <div className="text-5xl border-b pb-5 flex w-full pr-20">
              {name}
            </div>
            <div className="flex text-[17px] mt-3   ">
              <div>
                <span className="mr-1 ">{followers}</span> Follower
                {followers > 1 || followers === 0 ? "s" : ""}
              </div>
              <div className="ml-4">
                <span className="mr-1">{following}</span> Following
              </div>
            </div>
          </div>
        </div>
        <div className="flex  mt-5 justify-between">
          <div
            className="[&>button]:text-[14px] [&>button]:bg-blue-600  [&>button]:hover:bg-blue-900 [&>button]:transition-all [&>button]:duration-200
                   [&>button]:cursor-pointer  [&>button]:pl-6 [&>button]:pr-6 [&>button]:p-1 [&>button]:h-fit [&>button]:rounded-[7px] [&>button]:font-semibold
            [&>button]:text-white  "
          >
            <button
              onClick={async () => {
                if (!token) return;

                const res = await toggleFollow(unique_id, token);

                if (!res) return;

                setIsFollowing(res.following);
                setFollowers((prev) => (res.following ? prev + 1 : prev - 1));
              }}
              className={`${isFollowing ? "text-black! bg-zinc-100!" : ""}`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
            <button className="ml-5">Send message</button>
          </div>
          <div
            className="select-none  w-fit text-black border flex  relative "
            ref={filterRef}
          >
            <div
              className="bg-zinc-200/90 w-fit  pl-2 pr-2 font-semibold rounded-[5px]
                  text-[18px] flex justify-center items-center cursor-pointer "
              onClick={() => {
                setDisplayFilter((prev) => !prev);
              }}
            >
              {sortBy} <IoIosArrowDown className="ml-3 " />
            </div>
            <ul
              className={`${displayFilter ? "flex" : "hidden"}  flex-col absolute z-50 bg-zinc-100 rounded-[5px] top-8 right-0 
                    w-32 text-[18px] [&>li]:p-2 [&>li]:hover:bg-zinc-200 [&>li]:cursor-pointer [&>li]:font-semibold [&>li]:hover:text-purple-500`}
            >
              <li onClick={() => selectFilter("Newest")}>Newest</li>
              <li onClick={() => selectFilter("Oldest")}>Oldest</li>

              <li onClick={() => selectFilter("Highest rate")}>Highest rate</li>

              <li onClick={() => selectFilter("Lowest rate")}>Lowest rate</li>

              <li onClick={() => selectFilter("Release date")}>Release date</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap mx-auto max-w-[95%] justify-start mt-5">
        {sortedCards?.map((c) => {
          return (
            <Link to={`/profile/${unique_id}/${c.id}`}>
              <div
                key={c.id}
                className="w-60 mt-5  ml-5 mr-5 overflow-hidden relative  group cursor-pointer select-none
                  shadow-black/60 shadow-[15px_0_15px_rgba(0,0,0,0.6)] "
                onClick={() => {}}
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
                <div></div>
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

export default VisitorPov;
