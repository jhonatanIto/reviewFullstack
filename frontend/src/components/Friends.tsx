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
  const [name, setName] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [followingCards, setFollowingCards] = useState<FollowingCards[]>([]);
  const tab = "friends";
  const { token, setLoading } = useUser();
  const navigate = useNavigate();
  const searchBoxRef = useRef<HTMLDivElement>(null);

  const searchUsers = () => {
    fetch(
      `${backend}/api/users/search?q=${encodeURIComponent(name)}&type=${searchType}`,
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
      if (!name) {
        setUsers([]);
        return;
      }

      searchUsers();
    }, 300);

    return () => clearTimeout(timeout);
  }, [name]);

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
        searchBoxRef.current &&
        !searchBoxRef.current.contains(e.target as Node)
      ) {
        setUsers([]);
        setName("");
      }
    };
    window.addEventListener("mousedown", closeSearch);
    return () => window.removeEventListener("mousedown", closeSearch);
  }, []);

  return (
    <div className="mt-10 ">
      <div className="flex  justify-between pl-[8%] pr-[8%]">
        <div className="text-white text-3xl">Following :</div>

        <div className="flex flex-col relative ">
          <div className="flex text-white items-center ">
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

          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            className="bg-white text-[20px] outline-none pl-3 mt-3"
            placeholder="Search name"
          />
          <div
            ref={searchBoxRef}
            style={{ display: users.length > 0 ? "block" : "none" }}
            className="absolute top-18 right-0 bg-white pl-3 pr-3 pb-3 w-100"
          >
            {users.map((u) => {
              return (
                <div
                  className="flex mt-2 border-2 rounded-2xl p-2 items-center hover:border-blue-400 border-zinc-400/80 
                transition-all duration-200"
                >
                  <img
                    src={u.picture || userpic}
                    className="w-15 h-15 rounded-full object-cover cursor-pointer bg-zinc-600"
                    onClick={() => clickUser(u.unique_id)}
                  />
                  <div className="flex flex-col justify-center ml-4 text-zinc-800">
                    <div
                      className="font-bold text-[20px] cursor-pointer  w-fit"
                      onClick={() => clickUser(u.unique_id)}
                    >
                      {u.name}
                    </div>
                    <div>ID: {u.unique_id}</div>
                  </div>
                  <button
                    className={`bg-blue-600 text-[17px] hover:bg-blue-900 transition-all duration-200 font-semibold select-none
                   cursor-pointer text-white pl-6 pr-6 p-1 h-fit rounded-[10px] ml-auto   ${u.isFollowing ? "text-black! bg-zinc-200! " : ""}`}
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
      </div>
      <div className="w-full text-white mt-7  flex pl-[3%] pr-[3%]">
        {following.map((f) => {
          return (
            <div className="name flex flex-col w-fit items-center ml-2 mr-2">
              <img
                src={f.picture || userpic}
                className="w-40 h-40 rounded-full object-cover cursor-pointer bg-zinc-600"
                onClick={() => {
                  navigate(`/profile/${f.unique_id}`);
                }}
              />
              <div className="text-2xl">{f.name}</div>
              <div className="text-[20px]">Review: {f.reviews}</div>
            </div>
          );
        })}
      </div>
      {followingCards.length !== 0 && (
        <div className="absolute w-full bottom-[5%] flex flex-col justify-center select-none mt-10  overflow-hidden pl-[1%]">
          <div className="text-[23px] text-white">Recent reviews</div>
          <div
            className="flex mt-10 overflow-x-scroll no-scrollbar"
            onWheel={(e) => {
              e.currentTarget.scrollLeft += e.deltaY;
            }}
          >
            {followingCards.map((c) => {
              return (
                <div className="relative w-[14%] shrink-0 ">
                  <Link className="" to={`/friends/${c.id}`}>
                    <img
                      src={c.user_picture || userpic}
                      className="absolute w-20 h-20 rounded-full z-20 object-cover cursor-pointer  select-none bg-zinc-600"
                    />
                  </Link>
                  <Link to={`/friends/${c.id}`}>
                    <div
                      key={c.id}
                      className="mt-5  ml-5 mr-5 overflow-hidden relative  group cursor-pointer select-none
                                shadow-black/60 shadow-[15px_0_15px_rgba(0,0,0,0.6)] "
                    >
                      <div
                        className="opacity-0 w-full group-hover:opacity-100 transition-opacity 
                           p-2  duration-200 absolute inset-0 bg-black/70 z-10 flex items-center flex-col backdrop-blur-[3px] "
                      >
                        <div className="text-2xl text-center flex items-center text-amber-600  justify-center mt-5 ">
                          <IoStar />
                          <div className="ml-1 ">{c.rate}</div>
                        </div>
                        <div className="text-white text-[20px] mt-[1%] text-center">
                          {c.review}
                        </div>
                      </div>

                      <img
                        className="group-hover:scale-110 transition-transform duration-200 "
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
