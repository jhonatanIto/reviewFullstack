import { useEffect, useRef, useState } from "react";
import userpic from "../images/user.png";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  backend,
  getFollowing,
  getFollowingCards,
  toggleFollow,
} from "../utils/fetchData";
import { useUser } from "../context/useUser";
import { IoStar } from "react-icons/io5";

interface User {
  name: string;
  unique_id: string;
  picture: string;
  reviews: number;
  isFollowing: boolean;
}
export interface FollowingCards {
  comments_count: number;
  created_at: string;
  description: string;
  id: number;
  liked_by_user: boolean;
  likes_count: number;
  poster: string;
  rate: number;
  release: string;
  review: string;
  title: string;
  tmdb_id: number;
  user_name: string;
  user_picture: string | null;
  user_unique_id: string;
}

const Friends = () => {
  const [searchType, setSearchType] = useState("name");
  const [users, setUsers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [followingCards, setFollowingCards] = useState<FollowingCards[]>([]);
  const tab = "friends";
  const { token, setLoading, search, typeRef, displayInput, searchUserRes } =
    useUser();
  const navigate = useNavigate();

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const searchUsers = () => {
    fetch(
      `${backend}/api/users/search?q=${encodeURIComponent(search)}&type=${searchType}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then((res) => res.json())
      .then((data) => setUsers(data));
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!search) {
        setUsers([]);
        return;
      }

      searchUsers();
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    const followingList = async () => {
      if (!token) return;
      const data = await getFollowing(token);

      if (!data) return;
      setFollowing(data.following);
    };

    followingList();
  }, [token]);

  const getFollowCards = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const fCards = await getFollowingCards(token);
      if (!fCards) return;

      setFollowingCards(fCards);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFollowCards();
  }, [token]);

  const clickUser = (unique: string) => {
    navigate(`/profile/${unique}`);
  };

  useEffect(() => {
    const closeSearch = (e: MouseEvent) => {
      if (
        searchUserRes.current &&
        !searchUserRes.current.contains(e.target as Node)
      ) {
        setUsers([]);
      }
    };
    window.addEventListener("mousedown", closeSearch);
    return () => window.removeEventListener("mousedown", closeSearch);
  }, []);

  return (
    <div className="mt-6 md:mt-10 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:justify-between md:pl-[8%] md:pr-[8%]">
        <div className="text-white text-xl md:text-3xl mb-4 md:mb-0">
          Following :
        </div>
        <div
          ref={typeRef}
          className={`${!displayInput ? "hidden" : ""} flex text-white items-center  md:right-30 right-10 absolute`}
        >
          <label className=" flex cursor-pointer items-center">
            <input
              type="radio"
              name="search"
              value="id"
              checked={searchType === "id"}
              className=" cursor-pointer accent-purple-500 w-4 h-4 "
              onChange={(e) => setSearchType(e.target.value)}
            />{" "}
            <span className="ml-1">ID</span>
          </label>
          <label className="flex cursor-pointer ml-4 items-center">
            <input
              type="radio"
              name="search"
              value="name"
              checked={searchType === "name"}
              className="cursor-pointer accent-purple-500 w-4 h-4 "
              onChange={(e) => setSearchType(e.target.value)}
            />{" "}
            <span className="ml-1">Name</span>
          </label>
        </div>

        <div
          ref={searchUserRes}
          style={{ display: users.length > 0 ? "block" : "none" }}
          className="absolute md:top-28 md:right-65 bg-white p-3 w-full md:w-100 z-20 rounded-lg "
        >
          {users.map((u) => {
            return (
              <div
                key={u.unique_id}
                className="flex mt-2 border-2 rounded-xl p-2 items-center hover:border-blue-400 border-zinc-400/80 transition-all"
              >
                <img
                  src={u.picture || userpic}
                  className="w-12 h-12 md:w-15 md:h-15 rounded-full object-cover cursor-pointer bg-zinc-600"
                  onClick={() => clickUser(u.unique_id)}
                />

                <div className="flex flex-col justify-center ml-3 text-zinc-800">
                  <div
                    className="font-bold text-lg md:text-[20px] cursor-pointer w-fit"
                    onClick={() => clickUser(u.unique_id)}
                  >
                    {u.name}
                  </div>

                  <div className="text-sm">ID: {u.unique_id}</div>
                </div>

                <button
                  className={`ml-auto text-sm md:text-[17px] font-semibold cursor-pointer text-white px-4 py-1 rounded-lg
                    ${
                      u.isFollowing
                        ? "bg-zinc-200 text-black"
                        : "bg-blue-600 hover:bg-blue-900"
                    }`}
                  onClick={async () => {
                    if (!token) return alert("Log in to follow");

                    await toggleFollow(u.unique_id, token);
                    await searchUsers();
                  }}
                >
                  {u.isFollowing ? "Following" : "Follow"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="w-full text-white md:mt-10 flex overflow-x-scroll no-scrollbarChat  justify-center md:justify-start
       md:pl-[3%] md:pr-[3%] gap-6"
        onWheel={(e) => {
          e.currentTarget.scrollLeft += e.deltaY;
        }}
      >
        {following.map((f) => {
          return (
            <div
              key={f.unique_id}
              className="flex shrink-0 flex-col items-center"
            >
              <img
                draggable={false}
                src={f.picture || userpic}
                className="w-16 h-16 md:w-32 md:h-32 rounded-full object-cover cursor-pointer bg-zinc-600"
                onClick={() => {
                  navigate(`/profile/${f.unique_id}`);
                }}
              />

              <div className="text-lg md:text-2xl mt-2">{f.name}</div>
              <div className="text-sm md:text-[20px]">Review: {f.reviews}</div>
            </div>
          );
        })}
      </div>

      {followingCards.length !== 0 && (
        <div className="w-full mt-10 md:absolute md:bottom-[5%] flex flex-col select-none md:pl-[1%]">
          <div className="text-lg md:text-[23px] text-white mb-4">
            Recent reviews
          </div>

          <div
            ref={sliderRef}
            className="flex overflow-x-scroll no-scrollbar gap-4 pb-4 select-none cursor-grab active:cursor-grabbing"
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
            {followingCards.map((c) => {
              return (
                <div
                  key={c.id}
                  className="relative w-[50%] md:w-[14%] shrink-0"
                >
                  <Link to={`/friends/${c.id}`}>
                    <img
                      draggable={false}
                      src={c.user_picture || userpic}
                      className="absolute w-12 h-12 md:w-20 md:h-20 rounded-full z-20 object-cover cursor-pointer bg-zinc-600"
                    />
                  </Link>

                  <Link draggable={false} to={`/friends/${c.id}`}>
                    <div className="mt-4 md:mt-5 ml-3 mr-3 overflow-hidden relative group cursor-pointer shadow-black/60 shadow-[15px_0_15px_rgba(0,0,0,0.6)]">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity p-2 absolute inset-0 bg-black/70 z-10 flex items-center flex-col backdrop-blur-[3px]">
                        <div className="text-xl md:text-2xl text-amber-600 flex items-center mt-3">
                          <IoStar />
                          <div className="ml-1">{c.rate}</div>
                        </div>

                        <div className="text-white text-sm md:text-[20px] mt-2 text-center">
                          {c.review}
                        </div>
                      </div>

                      <img
                        draggable={false}
                        className="group-hover:scale-110 transition-transform duration-200"
                        src={c.poster}
                      />
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Outlet context={{ cards: followingCards, tab, setFollowingCards }} />
    </div>
  );
};

export default Friends;
