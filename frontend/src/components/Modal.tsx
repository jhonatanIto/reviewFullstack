import { useEffect, useRef, useState } from "react";
import Stars from "./Stars";
import { useUser } from "../context/useUser";
import useRate from "../hooks/useRate";

interface ModalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  moviePoster: string | undefined;
  movieName: string | undefined;
  movieRelease: string | undefined;
  movieDescription: string | undefined;
}

const Modal = ({
  modal,
  moviePoster,
  setModal,
  movieName,
  movieDescription,
  movieRelease,
}: ModalProps) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [review, setReview] = useState<string>("");
  const { token, loadCards } = useUser();
  const { rate, setRate } = useRate();

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
      rate,
      review,
    };

    if (!rate) return;
    if (!token) return console.log("Create an account to save review");
    try {
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
      console.log(data.message);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{ opacity: modal ? 1 : 0, pointerEvents: modal ? "auto" : "none" }}
      className=" flex justify-center items-center w-full h-screen fixed m-0 bg-black/65 top-0 left-0 z-50 "
    >
      <div
        ref={boxRef}
        className="flex  items-center bg-white/20 relative rounded-2xl overflow-hidden shadow-black shadow-lg"
      >
        <img className="" src={moviePoster} />

        <div className="p-5 flex flex-col items-center justify-center">
          <Stars rate={rate} setRate={setRate} top={100} size={35} />
          <textarea
            value={review}
            spellCheck={false}
            placeholder="Write your review"
            className="w-100 h-100 text-2xl  outline-none bg-white rounded-2xl p-3 flex text-center"
            onChange={(e) => setReview(e.target.value)}
          />
          <button
            className="text-white bg-purple-600 text-2xl pl-9 pr-9 transition-all duration-200
          rounded-[10px] flex p-1 mt-10 absolute bottom-23 cursor-pointer hover:bg-purple-700"
            onClick={postCard}
          >
            save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
