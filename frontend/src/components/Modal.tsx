import { useEffect, useRef } from "react";
import Stars from "./Stars";
import { useUser } from "../context/useUser";
import useRate from "../hooks/useRate";
import useNotification from "../hooks/useNotification";
import { useMovie } from "../context/useMovie";

const Modal = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const { token, loadCards, setLoading, loading } = useUser();
  const { rate, setRate, setReview, review } = useRate();
  const { successNotification, errorNotification } = useNotification();

  const {
    setModal,
    modal,
    movieName,
    movieRelease,
    movieDescription,
    moviePoster,
    movieImage,
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
    };

    if (!rate) return;
    if (!token) return console.log("Create an account to save review");
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/cards", {
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
        className={`flex  items-center bg-white/20 relative rounded-2xl overflow-hidden shadow-black shadow-lg
         transition-all duration-300  ease-in-out  ${modal ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-24"}`}
      >
        <img src={moviePoster} />

        <div className="p-5 flex flex-col items-center justify-center">
          <div
            style={{ color: "oklch(82.8% 0.189 84.429)" }}
            className="absolute top-10 text-[25px] "
          >
            Rate: {rate}/10
          </div>
          <Stars rate={rate} setRate={setRate} top={100} size={30} />
          <textarea
            value={review}
            spellCheck={false}
            placeholder="Write your review"
            className="w-100 h-100 text-2xl  outline-none bg-white rounded-2xl p-3 flex text-center shadow-black/30 shadow-lg"
            onChange={(e) => setReview(e.target.value)}
          />
          <button
            className="text-white bg-purple-600 text-2xl pl-9 pr-9 transition-all duration-200 shadow-zinc-800/80 shadow-md
          rounded-[10px] flex p-1 mt-10 absolute bottom-23 cursor-pointer hover:bg-purple-700"
            onClick={postCard}
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
