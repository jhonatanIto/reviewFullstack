import { IoAddOutline } from "react-icons/io5";
import { useUser } from "../context/useUser";
import useNotification from "../hooks/useNotification";
import { useMovie } from "../context/useMovie";

const Middle = () => {
  const { token } = useUser();
  const { errorNotification, successNotification } = useNotification();
  const {
    movieName,
    movieRelease,
    movieDescription,
    moviePoster,
    movieImage,
    setModal,
  } = useMovie();

  const postWatchlist = async () => {
    if (!token) return errorNotification("Sign in to save movies");

    const body = {
      title: movieName,
      release: movieRelease,
      description: movieDescription,
      poster: moviePoster,
      banner: movieImage,
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
          onClick={postWatchlist}
        >
          <IoAddOutline className="text-2xl" />
          <span className="ml-3">watch list</span>
        </button>
      </div>
    </div>
  );
};

export default Middle;
