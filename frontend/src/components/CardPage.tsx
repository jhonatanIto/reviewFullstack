import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../context/useUser";
import { useEffect, useRef, useState } from "react";
import useRate from "../hooks/useRate";
import Stars from "./Stars";
import useNotification from "../hooks/useNotification";

const CardPage = () => {
  const { id } = useParams();
  const { cards, token, loadCards, setLoading, loading } = useUser();
  const boxRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  const [open, setOpen] = useState(false);

  const { setRate, setReview, rate, review } = useRate();
  const { successNotification, errorNotification } = useNotification();

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
        navigate("/reviews");
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
      setLoading(true);
      const res = await fetch(`http://localhost:3000/api/cards/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rate, review }),
      });

      const data = await res.json();

      if (!res.ok) {
        errorNotification(data?.message);
        return console.log(data?.message);
      }

      loadCards();
      successNotification("Review updated");
    } catch (error) {
      console.error(error);
      errorNotification("couldn't update");
    } finally {
      setLoading(false);
    }
  };

  const deleteCard = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3000/api/cards/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        errorNotification(data?.message);
        return console.log(data?.message);
      }

      loadCards();
      navigate("/reviews");
      successNotification("Review deleted");
    } catch (error) {
      console.error(error);
      errorNotification("Couldn't delete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={` flex justify-center items-center w-full h-screen fixed m-0   transition-opacity duration-200
     bg-black/60 top-0 left-0 z-10 backdrop-blur-[5px] `}
    >
      <div
        ref={boxRef}
        className={`flex  items-center bg-white/20 relative rounded-2xl overflow-hidden shadow-black shadow-lg 
           ${open ? " translate-y-0 scale-100" : "translate-y-10 scale-70 opacity-0"} transition-all duration-200 ease-in-out`}
      >
        <div className="relative">
          <div
            className="opacity-0 w-full hover:opacity-100 transition-all duration-400 absolute cursor-default flex-col
             p-8 text-center text-white text-[26px] inset-0 bg-black/70 z-10 flex items-center  backdrop-blur-[3px] "
          >
            <div className="max-text-[35px] text-purple-500 font-bold">
              {currCard?.title}
            </div>
            <div className="mt-15">{currCard?.description}</div>
            <div className="absolute bottom-10 flex   text-[20px]">
              Release date: {currCard?.release}
            </div>
          </div>
          <img src={currCard?.poster} />
        </div>

        <div className="p-5 flex flex-col items-center justify-center">
          <div
            className={`flex items-center justify-center ${!edit ? "pointer-events-none" : ""} `}
          >
            <div
              style={{ color: "oklch(82.8% 0.189 84.429)" }}
              className="absolute top-10 text-[25px] select-none "
            >
              Rate: {rate}/10
            </div>
            <Stars rate={rate} setRate={setRate} top={90} size={30} />
          </div>

          <textarea
            disabled={!edit}
            value={review}
            spellCheck={false}
            placeholder="Write your review"
            className="w-100 h-100 text-2xl mt-15  outline-none bg-white rounded-2xl p-3 flex text-center shadow-black/30 shadow-lg"
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
                          hover:shadow-none select-none"
              onClick={() => {
                setEdit((prev) => !prev);
                if (edit) {
                  updateCard();
                }
              }}
              disabled={loading}
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
