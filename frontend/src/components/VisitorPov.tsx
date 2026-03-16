import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import {
  fetchProfile,
  fetchProfileLogged,
  toggleFollow,
} from "../utils/fetchData";

import { IoStar } from "react-icons/io5";
import type { Cards } from "../context/UserContext";
import { useUser } from "../context/useUser";
import type { SortOption } from "./Gallery";
import { IoIosArrowDown } from "react-icons/io";
import userpic from "../images/user.png";

const VisitorPov = () => {
  const [name, setName] = useState("");
  const [picture, setPicture] = useState(userpic);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const tab = "profile";

  const [cards, setCards] = useState<Cards[]>([]);
  const unique_id = useParams().unique as string;
  const { token } = useUser();

  const [displayFilter, setDisplayFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [sortBy, setSortBy] = useState<SortOption>(
    () => (localStorage.getItem("MyReview_sortBy") as SortOption) || "Newest",
  );
  const selectFilter = (value: SortOption) => {
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
    if (!unique_id) return;
    try {
      const data = await fetchProfile(unique_id);

      setName(data.user.name);
      setPicture(data.user.picture || userpic);
      setFollowers(data.stats.followers);
      setFollowing(data.stats.following);
      setCards(data.cards || []);
    } catch (err) {
      console.error(err);
    }
  };
  const getProfileLogged = async () => {
    if (!unique_id || !token) return;
    try {
      const data = await fetchProfileLogged(unique_id, token);

      console.log(data);

      setName(data.user.name);
      setPicture(data.user.picture || userpic);
      setFollowers(data.stats.followers);
      setFollowing(data.stats.following);
      setIsFollowing(data.isFollowing);
      setCards(data.cards);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!token) {
      getProfile();
    } else {
      getProfileLogged();
    }
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
    <div className="mt-6 md:mt-10 w-full">
      <div className="flex text-white flex-col px-4 md:pl-[8%] md:pr-[8%]">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <img
            src={picture}
            className="w-28 h-28 md:w-35 md:h-35 rounded-full object-cover"
          />

          <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-center md:items-start w-full">
            <div className="text-3xl md:text-5xl border-b pb-3 md:pb-5 w-full md:pr-20 text-center md:text-left">
              {name}
            </div>

            <div className="flex text-sm md:text-[17px] mt-3">
              <div>
                <span className="mr-1">{followers}</span>
                Follower{followers > 1 || followers === 0 ? "s" : ""}
              </div>

              <div className="ml-4">
                <span className="mr-1">{following}</span>
                Following
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row mt-6 md:justify-between gap-4">
          <div
            className="[&>button]:text-[14px] [&>button]:bg-blue-600
          [&>button]:hover:bg-blue-900 [&>button]:transition-all
          [&>button]:duration-200 [&>button]:cursor-pointer
          [&>button]:px-6 [&>button]:py-1 [&>button]:rounded-[7px]
          [&>button]:font-semibold [&>button]:text-white flex flex-col md:flex-row gap-3"
          >
            <button
              onClick={async () => {
                if (!token) return alert("Log in to follow");

                const res = await toggleFollow(unique_id, token);

                if (!res) return;

                setIsFollowing(res.following);
                setFollowers((prev) => (res.following ? prev + 1 : prev - 1));
              }}
              className={`${isFollowing ? "text-black! bg-zinc-100!" : ""}`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>

            <button>Send message</button>
          </div>

          <div
            className="select-none w-full md:w-fit text-black border flex relative"
            ref={filterRef}
          >
            <div
              className="bg-zinc-200/90 w-full md:w-fit px-3 py-1 font-semibold rounded-[5px]
            text-[16px] md:text-[18px] flex justify-center items-center cursor-pointer"
              onClick={() => {
                setDisplayFilter((prev) => !prev);
              }}
            >
              {sortBy} <IoIosArrowDown className="ml-3" />
            </div>

            <ul
              className={`${displayFilter ? "flex" : "hidden"}
            flex-col absolute z-50 bg-zinc-100 rounded-[5px] top-8 right-0
            w-full md:w-32 text-[16px] md:text-[18px]
            [&>li]:p-2 [&>li]:hover:bg-zinc-200
            [&>li]:cursor-pointer [&>li]:font-semibold
            [&>li]:hover:text-purple-500`}
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

      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6
      gap-5 mt-6 px-4 md:w-[80%] md:ml-auto md:mr-auto"
      >
        {sortedCards?.map((c) => {
          return (
            <Link key={c?.id} to={`/profile/${unique_id}/${c?.id}`}>
              <div
                className="overflow-hidden relative group cursor-pointer
              shadow-black/60 shadow-[15px_0_15px_rgba(0,0,0,0.6)]"
              >
                <div
                  className="opacity-0 w-full group-hover:opacity-100 transition-opacity
                duration-200 absolute inset-0 bg-black/70 z-10 flex
                items-center flex-col backdrop-blur-[3px]"
                >
                  <div className="text-xl md:text-3xl flex items-center justify-center mt-5 text-amber-600">
                    <IoStar />
                    <div className="ml-1">{c?.rate}</div>
                  </div>

                  <div className="text-white text-sm md:text-[20px] mt-[7%] text-center px-2">
                    {c?.review}
                  </div>
                </div>

                <img
                  className="group-hover:scale-110 transition-transform duration-200 w-full"
                  src={c?.poster}
                />
              </div>
            </Link>
          );
        })}
      </div>

      <Outlet context={{ cards, tab, getProfile }} />
    </div>
  );
};

export default VisitorPov;
