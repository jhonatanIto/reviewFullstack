import { useEffect, useState } from "react";
import naruto from "../images/naruto.jpg";

const Friends = () => {
  const [searchType, setSearchType] = useState("name");
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!name) return;

      fetch(`http://localhost:3000/api/users/search?1=${name}`)
        .then((res) => res.json())
        .then((data) => setUsers(data));
    }, 300);

    return () => clearTimeout(timeout);
  }, [name]);

  return (
    <div className="mt-10 pl-[8%] pr-[8%]">
      <div className="flex flex-col items-end justify-end ">
        <div className="flex flex-col relative">
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
            type="text"
            className="bg-white text-[20px] outline-none pl-3 mt-3"
            placeholder="Search name"
          />
          <div className="absolute top-18 right-0 bg-white p-3 w-100">
            <div className="flex border-2 rounded-2xl p-2 items-center border-zinc-400/80">
              <img
                src={naruto}
                className="w-15 h-15 rounded-full object-cover cursor-pointer"
              />
              <div className="flex flex-col justify-center ml-4 text-zinc-800">
                <div className="font-bold text-[20px] cursor-pointer">
                  Jhonatan
                </div>
                <div>ID: Ko8eJZVNCb</div>
              </div>
              <button className="bg-blue-600 text-[18px] cursor-pointer text-white pl-6 pr-6 p-1 h-fit rounded-[10px] ml-auto">
                Follow
              </button>
            </div>
          </div>
        </div>

        <div className="w-full text-white mt-7">
          <div className="name flex flex-col w-fit items-center ml-2 mr-2">
            <img
              src={naruto}
              className="w-40 h-40 rounded-full object-cover cursor-pointer"
            />
            <div className="text-2xl">Jhonatan</div>
            <div className="text-[20px]">Review: 32</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friends;
