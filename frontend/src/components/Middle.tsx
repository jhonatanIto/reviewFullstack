import { IoAddOutline } from "react-icons/io5";
import { useUser } from "../context/useUser";
import useNotification from "../hooks/useNotification";
import { useMovie } from "../context/useMovie";
import { PiTrashLight } from "react-icons/pi";
import { deleteWatchCard } from "../utils/fetchData";
import userpic from "../images/user.png";

import { IoStar } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import type { Cards } from "../context/UserContext";

interface Middle {
  feedCards: Cards[];
}

const Middle = ({ feedCards }: Middle) => {
  const { token } = useUser();
  const { errorNotification, successNotification } = useNotification();
  const {
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
      const res = await fetch("http://localhost:3000/api/watchlist", {
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

  return (
    <div className="text-white ml-[7%] mt-10 flex justify-between">
      <div>
        <div className="text-[65px]">{movieName}</div>
        <div className="text-2xl opacity-70">{movieRelease}</div>
        <div className="mt-10 max-h-47.5   overflow-scroll  no-scrollbar text-2xl  w-210">
          {movieDescription}
        </div>
        <div className="flex mt-10  items-center ">
          <button
            className=" bg-purple-500 p-2 pl-6 cursor-pointer pr-6  duration-200
              text-[20px] rounded-[10px] text-black font-semibold hover:text-white hover:bg-purple-600 transition-all"
            onClick={() => setModal(true)}
          >
            Create Review
          </button>
          <button
            className="flex text-zinc-500 hover:text-zinc-100 items-center border p-2 cursor-pointer pl-6 pr-6
         rounded-[10px] text-[20px] ml-5 transition-all duration-200"
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
              {" "}
              {inWatchlist ? "Remove from watchlist" : "Watch list"}{" "}
            </span>
          </button>
        </div>
      </div>
      <div className=" w-[37%] h-125 mt-4 mr-[1%] rounded-2xl p-1  overflow-scroll no-scrollbar">
        {feedCards.map((c) => {
          return (
            <div
              key={c.id}
              className="border border-white/20 rounded-2xl   flex p-1 items-center backdrop-blur-[70px] 
              shadow-[0_4px_20px_rgba(0,0,0,0.25)] mt-3 select-none"
            >
              <div className=" flex flex-col items-center ml-3 group">
                <div className="font-semibold group-hover:text-purple-500 transition-all duration-200 cursor-pointer">
                  {c.user_name}
                </div>
                <div className="overflow-hidden rounded-full">
                  <img
                    src={c.user_picture ?? userpic}
                    className="w-16 h-16 rounded-full object-cover cursor-pointer group-hover:scale-110 
                   bg-zinc-600  duration-200 transition-all"
                    onClick={() => navigate(`/profile/${c.user_unique_id}`)}
                  />
                </div>
              </div>

              <div className="ml-3 text-[20px]">
                <div className="flex">
                  Rated:{" "}
                  <span className="text-amber-600 flex items-center ml-2">
                    {c?.rate} <IoStar className="text-[16px] ml-1" />
                  </span>
                </div>

                <button
                  className="border rounded-2xl pl-3 pr-3 mt-2 cursor-pointer hover:bg-purple-500 hover:border-white/0 transition-all duration-200
                 "
                  onClick={() => {
                    navigate(`/${c.user_unique_id}/${c.id}`);
                  }}
                >
                  Review
                </button>
              </div>
              <div
                className="ml-auto flex items-center border border-white/20 rounded-2xl p-1 pl-2 mr-0.5 cursor-pointer
                duration-200 transition-all hover:border-purple-500 "
                onClick={() => {
                  setMovieImage(c.banner);
                  setMovieDescription(c.description);
                  setMovieName(c.title);
                  setMoviePoster(c.poster);
                  setMovieRelease(c.release);
                  setMovieId(c.id);
                }}
              >
                <div className="mr-4  text-[20px]  flex text-center ">
                  {c.title}
                </div>
                <img src={c.poster} className="h-20  rounded-2xl" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Middle;
