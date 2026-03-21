import { useEffect, useRef } from "react";
import Stars from "./Stars";
import { useUser } from "../context/useUser";
import useRate from "../hooks/useRate";
import useNotification from "../hooks/useNotification";
import { useMovie } from "../context/useMovie";
import { useNavigate } from "react-router-dom";
import { backend } from "../utils/fetchData";
import { IoArrowBackOutline } from "react-icons/io5";

const Modal = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const { token, loadCards, setLoading, loading, user } = useUser();
  const { rate, setRate, setReview, review } = useRate();
  const { successNotification, errorNotification } = useNotification();
  const navigate = useNavigate();

  const {
    setModal,
    modal,
    movieName,
    movieRelease,
    movieDescription,
    moviePoster,
    movieImage,
    movieId,
  } = useMovie();

  useEffect(() => {
    const closeModal = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setModal(false);
        setReview("");
        setRate(5);
      }
    };

    window.addEventListener("mousedown", closeModal);

    return () => window.removeEventListener("mousedown", closeModal);
  }, []);

  const postCard = async () => {
    const body = {
      title: movieName,
      release: movieRelease,
      description: movieDescription,
      poster: moviePoster,
      banner: movieImage,
      rate,
      review,
      tmdb_id: movieId,
    };

    if (!rate) return;
    if (!token) return console.log("Create an account to save review");
    try {
      setLoading(true);
      const res = await fetch(`${backend}/api/cards`, {
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
        return;
      }

      loadCards();
      setModal(false);
      successNotification("Review created!");
      console.log(data.message);
    } catch (error) {
      console.error(error);
      errorNotification("Couldn't create Review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ opacity: modal ? 1 : 0, pointerEvents: modal ? "auto" : "none" }}
      className={` flex justify-center items-center w-full h-screen fixed m-0 bg-black/65 top-0 left-0 z-50 
         transition-all duration-300 backdrop-blur-[2px] `}
    >
      <div
        ref={boxRef}
        className={`flex w-[93%] md:h-fit  md:w-238 h-[95%] justify-around md:mt-0  pb-10 md:pb-0 items-center  flex-col bg-white/20 relative rounded-2xl   shadow-black shadow-lg 
          md:flex-row  ${modal ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-24"}`}
      >
        <div
          className="absolute md:opacity-0 md:pointer-events-none text-white top-10 left-3 text-4xl"
          onClick={() => setModal(false)}
        >
          <IoArrowBackOutline />
        </div>
        <div className="md:w-full w-[48%] ">
          <img src={moviePoster ? moviePoster : ""} />
        </div>

        <div className="p-5 flex flex-col items-center w-full justify-center">
          <div className="md:top-20 top-[46%] absolute flex flex-col items-center text-[20px]">
            <div
              style={{ color: "oklch(82.8% 0.189 84.429)" }}
              className="text-[25px] "
            >
              Rate: {rate}/10
            </div>
            <div className="md:mt-5  mt-2">
              <Stars rate={rate} setRate={setRate} top={100} size={24} />
            </div>
          </div>

          <textarea
            value={review}
            spellCheck={false}
            placeholder="Write your review"
            className="w-full h-42 md:h-90 text-[19px] md:text-[24px] outline-none bg-white rounded-2xl p-3 flex text-center shadow-black/30 shadow-lg mt-15"
            onChange={(e) => setReview(e.target.value)}
          />
          <button
            className="text-white bg-purple-600 text-2xl pl-9 pr-9 transition-all duration-200 shadow-zinc-800/80 shadow-md
          rounded-[10px] flex p-1 md:mb-10 mb-[2%] absolute bottom-3 cursor-pointer hover:bg-purple-700"
            onClick={() => {
              if (user) {
                postCard();
              } else {
                setModal(false);
                navigate("/login");
              }
            }}
            disabled={loading}
          >
            save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
