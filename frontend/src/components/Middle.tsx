import { IoAddOutline } from "react-icons/io5";
import { useUser } from "../context/useUser";
import useNotification from "../hooks/useNotification";
import { useMovie } from "../context/useMovie";
import { PiTrashLight } from "react-icons/pi";
import { deleteWatchCard } from "../utils/fetchData";

const Middle = () => {
  const { token } = useUser();
  const { errorNotification, successNotification } = useNotification();
  const {
    movieName,
    movieRelease,
    movieDescription,
    moviePoster,
    movieImage,
    movieId,
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

  return (
    <div className="text-white ml-[7%] mt-10">
      <div className="text-[65px]">{movieName}</div>
      <div className="text-2xl opacity-70">{movieRelease}</div>
      <div className="mt-10 max-h-47.5   overflow-scroll  no-scrollbar text-2xl  w-200">
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
  );
};

export default Middle;
