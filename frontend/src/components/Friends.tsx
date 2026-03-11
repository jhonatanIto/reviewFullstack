import { useEffect, useState } from "react";
import naruto from "../images/naruto.jpg";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { getFollowing, getFollowingCards } from "../utils/fetchData";
import { useUser } from "../context/useUser";
import { IoStar } from "react-icons/io5";

interface User {
  name: string;
  unique_id: string;
  picture: string;
  reviews: number;
}

const Friends = () => {
  const [searchType, setSearchType] = useState("name");
  const [name, setName] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [followingCards, setFollowingCards] = useState([]);
  const owner = "friends";
  const { token, setLoading } = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!name) {
        setUsers([]);
        return;
      }

      fetch(
        `http://localhost:3000/api/users/search?q=${encodeURIComponent(name)}&type=${searchType}`,
      )
        .then((res) => res.json())
        .then((data) => setUsers(data));
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

  useEffect(() => {
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

    getFollowCards();
  }, [token]);

  const clickUser = (unique: string) => {
    navigate(`/profile/${unique}`);
  };
  console.log(followingCards);
  return (
    <div className="mt-10 pl-[8%] pr-[8%]">
      <div className="flex  justify-between ">
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
                    src={naruto}
                    className="w-15 h-15 rounded-full object-cover cursor-pointer"
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
                    className="bg-blue-600 text-[18px] hover:bg-blue-900 transition-all duration-200
                   cursor-pointer text-white pl-6 pr-6 p-1 h-fit rounded-[10px] ml-auto"
                  >
                    Follow
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="w-full text-white mt-7 ">
        {following.map((f) => {
          return (
            <div
              className="name flex flex-col w-fit items-center ml-2 mr-2"
              onClick={() => {
                navigate(`/profile/${f.unique_id}`);
              }}
            >
              <img
                src={naruto}
                className="w-40 h-40 rounded-full object-cover cursor-pointer"
              />
              <div className="text-2xl">{f.name}</div>
              <div className="text-[20px]">Review: {f.reviews}</div>
            </div>
          );
        })}
      </div>
      <div className=" text-white mt-7">
        <div className="text-[23px]">Recent created</div>
        <div className="flex mt-10">
          {followingCards.map((c) => {
            return (
              <div>
                <Link to={`/friends/${c.user_unique_id}/${c.id}`}>
                  <img
                    src={naruto}
                    className="absolute w-20 h-20 rounded-full z-20 object-cover cursor-pointer"
                  />
                </Link>
                <Link to={`/friends/${c.user_unique_id}/${c.id}`}>
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
      <Outlet context={{ cards: followingCards, owner }} />
    </div>
  );
};

export default Friends;
