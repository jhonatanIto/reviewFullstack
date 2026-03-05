import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../context/useUser";
import { useEffect, useRef } from "react";
import useRate from "../hooks/useRate";
import Stars from "./Stars";

const CardPage = () => {
  const { id } = useParams();
  const { cards } = useUser();
  const boxRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { setRate, setReview } = useRate();

  const currCard = cards.find((c) => c.id === Number(id));

  useEffect(() => {
    const closeModal = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        navigate("/gallery");
      }
    };

    window.addEventListener("mousedown", closeModal);

    return () => window.removeEventListener("mousedown", closeModal);
  }, []);

  return (
    <div
      className=" flex justify-center items-center w-full h-screen fixed m-0
     bg-black/20 top-0 left-0 z-50 backdrop-blur-[5px]"
    >
      <div
        ref={boxRef}
        className="flex  items-center bg-white/20 relative rounded-2xl overflow-hidden shadow-black shadow-lg"
      >
        <img src={currCard?.poster} />

        <div className="p-5 flex flex-col items-center justify-center">
          <Stars
            rate={Number(currCard?.rate)}
            setRate={setRate}
            top={100}
            size={38}
          />
          <textarea
            value={currCard?.review}
            spellCheck={false}
            placeholder="Write your review"
            className="w-100 h-100 text-2xl  outline-none bg-white rounded-2xl p-3 flex text-center"
            onChange={(e) => setReview(e.target.value)}
          />
          <button
            className="text-white bg-purple-600 text-2xl pl-9 pr-9 transition-all duration-200
          rounded-[10px] flex p-1 mt-10 absolute bottom-23 cursor-pointer hover:bg-purple-700"
          >
            save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardPage;
