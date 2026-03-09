import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProfile } from "../utils/fetchData";
import naruto from "../images/naruto.jpg";
import { IoStar } from "react-icons/io5";
import type { Cards } from "../context/UserContext";

const VisitorPov = () => {
  const [name, setName] = useState("");
  const [picture, setPicture] = useState("");
  const [user_unique, setUser_unique] = useState("");
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);

  const [cards, setCards] = useState<Cards>([]);

  const unique_id = useParams().unique as string;

  useEffect(() => {
    if (!unique_id) return;

    const getProfile = async () => {
      const data = await fetchProfile(unique_id);
      console.log(data);

      setName(data.friend.name);
      setPicture(data.friend.picture);
      setUser_unique(data.friend.unique_id);
      setFollowers(data.stats.followers);
      setFollowing(data.stats.following);
      setCards(data.cards);
    };

    getProfile();
  }, [unique_id]);

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
                <span className="mr-2 ">{followers}</span> Followers
              </div>
              <div className="ml-4">
                <span className="mr-2">{following}</span> Following
              </div>
            </div>
          </div>
        </div>
        <div
          className="[&>button]:text-[14px] [&>button]:bg-blue-600  [&>button]:hover:bg-blue-900 [&>button]:transition-all [&>button]:duration-200
                   [&>button]:cursor-pointer  [&>button]:pl-6 [&>button]:pr-6 [&>button]:p-1 [&>button]:h-fit [&>button]:rounded-[10px]
                 mt-5  "
        >
          <button>Follow</button>
          <button className="ml-5">Send message</button>
        </div>
      </div>
      <div className="flex flex-wrap mx-auto max-w-[95%] justify-start mt-5">
        {cards?.map((c) => {
          return (
            <div
              key={c.id}
              className="w-60 mt-5  ml-5 mr-5 overflow-hidden relative  group cursor-pointer select-none
                  shadow-black/60 shadow-[15px_0_15px_rgba(0,0,0,0.6)] "
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
          );
        })}
      </div>
    </div>
  );
};

export default VisitorPov;
