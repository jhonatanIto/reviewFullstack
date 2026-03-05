import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../context/useUser";
import { useEffect, useRef, useState } from "react";
import useRate from "../hooks/useRate";
import Stars from "./Stars";

const CardPage = () => {
  const { id } = useParams();
  const { cards, token, loadCards } = useUser();
  const boxRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  const [open, setOpen] = useState(false);

  const { setRate, setReview, rate, review } = useRate();

  const currCard = cards.find((c) => c.id === Number(id));

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const closeModal = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        navigate("/gallery");
      }
    };

    window.addEventListener("mousedown", closeModal);

    return () => window.removeEventListener("mousedown", closeModal);
  }, []);

  useEffect(() => {
    if (!currCard) return;
    setRate(Number(currCard?.rate));
    setReview(String(currCard?.review));
  }, [currCard]);

  const updateCard = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/cards/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rate, review }),
      });

      const data = await res.json();

      if (!res.ok) return console.log(data?.message);

      console.log(data);
      loadCards();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCard = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/cards/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) return console.log(data?.message);

      console.log(data);
      loadCards();
      navigate("/gallery");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className={` flex justify-center items-center w-full h-screen fixed m-0   transition-opacity duration-200
     bg-black/20 top-0 left-0 z-50 backdrop-blur-[5px] `}
    >
      <div
        ref={boxRef}
        className={`flex  items-center bg-white/20 relative rounded-2xl overflow-hidden shadow-black shadow-lg 
           ${open ? " translate-y-0 scale-100" : "translate-y-10 scale-70 opacity-0"} transition-all duration-200 ease-in-out`}
      >
        <img src={currCard?.poster} />

        <div className="p-5 flex flex-col items-center justify-center">
          <div
            className={`flex items-center justify-center ${!edit ? "pointer-events-none" : ""} `}
          >
            <Stars rate={rate} setRate={setRate} top={65} size={40} />
          </div>

          <textarea
            disabled={!edit}
            value={review}
            spellCheck={false}
            placeholder="Write your review"
            className="w-100 h-100 text-2xl  outline-none bg-white rounded-2xl p-3 flex text-center shadow-black/30 shadow-lg"
            onChange={(e) => setReview(e.target.value)}
          />
          <div className="flex justify-center">
            {edit && (
              <button
                className="text-white bg-zinc-500/0 text-[20px] w-30 justify-center items-center transition-all duration-200 rounded-[10px] 
                flex p-1 mt-10 ml-2 mr-2  bottom-23 cursor-pointer hover:bg-zinc-500/20 hover:shadow-zinc-800/80 hover:shadow-md"
                onClick={deleteCard}
              >
                Delete
              </button>
            )}
            <button
              className="text-white bg-purple-600 text-[20px] w-30 justify-center items-center transition-all duration-200
                          rounded-[10px] flex p-1 mt-10 ml-2 mr-2   bottom-23 cursor-pointer hover:bg-purple-800 shadow-zinc-800/80 shadow-md
                          hover:shadow-none"
              onClick={() => {
                setEdit((prev) => !prev);
                if (edit) {
                  updateCard();
                }
              }}
            >
              {edit ? "Save" : "Edit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPage;
