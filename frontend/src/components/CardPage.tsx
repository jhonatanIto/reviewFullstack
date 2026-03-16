import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../context/useUser";
import { useEffect, useState } from "react";
import useRate from "../hooks/useRate";
import Stars from "./Stars";
import useNotification from "../hooks/useNotification";
import { useOutletContext } from "react-router-dom";
import type { Cards } from "../context/UserContext";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";

import { FaRegCommentDots } from "react-icons/fa";
import { backend, toggleLike } from "../utils/fetchData";
import type { FollowingCards } from "./Friends";
import Comments from "./Comments";

interface OutletContextType {
  tab: string;
  getProfile: () => void;
  setFollowingCards: React.Dispatch<React.SetStateAction<FollowingCards[]>>;
}

export interface CommentSection {
  id: number;
  comment: string;
  name: string;
  unique_id: string;
  picture: string;
  likes: number;
  isLiked: boolean;
  created_at: string;
  isOwner: boolean;
}

const CardPage = () => {
  const { id, unique } = useParams();
  const [card, setCard] = useState<Cards>();
  const { token, loadCards, setLoading, loading } = useUser();
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentSection, setCommentSection] = useState<CommentSection[]>([]);

  const [open, setOpen] = useState(false);
  const [delModal, setDelModal] = useState(false);
  const [commentId, setCommentId] = useState(0);

  const { setRate, setReview, rate, review } = useRate();
  const { successNotification, errorNotification } = useNotification();

  const { tab } = useOutletContext<OutletContextType>();

  let profileUrl = "";

  switch (tab) {
    case "reviews":
      profileUrl = "reviews";
      break;
    case "profile":
      profileUrl = `profile/${unique}`;
      break;
    case "friends":
      profileUrl = `friends`;
      break;
    default:
      profileUrl = "/";
  }

  useEffect(() => {
    const fetchCard = async () => {
      setLoading(true);
      try {
        setOpen(false);
        if (!id) return;
        if (!token) {
          const res = await fetch(`${backend}/api/cards/${id}`);
          const data = await res.json();
          if (!res.ok) return console.log(data?.message);
          setCard(data);
        } else {
          const res = await fetch(`${backend}/api/cards/${id}/logged`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          if (!res.ok) return console.log(data?.message);
          setCard(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setOpen(true);
        setLoading(false);
      }
    };

    fetchCard();
  }, [id]);

  useEffect(() => {
    if (!card) return;
    setRate(Number(card?.rate));
    setReview(String(card?.review !== null ? card?.review : ""));
  }, [card]);

  const updateCard = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backend}/api/cards/${id}`, {
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
      const res = await fetch(`${backend}/api/cards/${id}`, {
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
      navigate(`/${profileUrl}`);
      successNotification("Review deleted");
    } catch (error) {
      console.error(error);
      errorNotification("Couldn't delete");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`${backend}/api/cards/comment/${id}`);

      const data = await res.json();
      if (!res.ok) return console.log(data?.message);

      setCommentSection(data.commentSection);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCommentsLogged = async () => {
    try {
      const res = await fetch(`${backend}/api/cards/commentLogged/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) return console.log(data?.message);

      setCommentSection(data.commentSection);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteComment = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backend}/api/cards/comment/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) return console.log(data?.message);

      setDelModal(false);
      fetchCommentsLogged();
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      onMouseDown={() => {
        navigate(`/${profileUrl}`);
      }}
      style={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
      className={` flex flex-col  items-center  md:justify-center  w-full fixed m-0 h-fit md:h-full transition-opacity duration-500 overflow-y-auto md:overflow-y-hidden
     bg-black/60 top-0 left-0 z-40 backdrop-blur-[5px] `}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className={`flex w-[93%]  md:w-238  justify-around md:mt-0 mt-5  pb-10 md:pb-0 items-center  flex-col bg-white/20 relative rounded-2xl   shadow-black shadow-lg 
          md:flex-row
           ${open ? " translate-y-0 scale-100" : "translate-y-10 scale-70 opacity-0"} transition-all duration-200 ease-in-out`}
      >
        <div className="relative md:w-full  w-[48%] md:mt-0 mt-8">
          <div
            className="opacity-0  hover:opacity-100 transition-all duration-400 absolute cursor-default flex-col
             p-8 text-center text-white text-[26px] inset-0 bg-black/70 z-10 flex items-center  backdrop-blur-[3px] "
          >
            <div className="max-text-[35px] text-purple-500 font-bold">
              {card?.title}
            </div>
            <div className="mt-[5%] text-[18px] md:text-[25px] max-h-[75%] overflow-scroll no-scrollbar">
              {card?.description}
            </div>
            <div className="absolute bottom-10 flex text-[20px]">
              Release date: {card?.release}
            </div>
          </div>
          <img src={card?.poster} className="rounded-l-2xl " />
        </div>

        <div className=" flex flex-col items-center justify-center w-full">
          <div
            className={`flex flex-col items-center justify-center ${!edit ? "pointer-events-none" : ""} `}
          >
            <div
              style={{ color: "oklch(82.8% 0.189 84.429)" }}
              className=" text-[18px] md:text-2xl select-none "
            >
              Rate: {rate}/10
            </div>
            <div className="mt-2">
              <Stars rate={rate} setRate={setRate} top={100} size={20} />
            </div>
          </div>

          <textarea
            disabled={!edit}
            value={review}
            spellCheck={false}
            placeholder={`${edit ? "Write your review" : ""}`}
            className="w-[90%] h-40 md:h-90 text-[19px] md:text-[24px] mt-5  outline-none bg-white rounded-2xl p-3 flex text-center shadow-black/30 shadow-lg"
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
            {tab === "reviews" && (
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
            )}
            {!edit && (
              <div className="flex  w-60 justify-around mt-10">
                <div className=" flex items-center  justify-around ">
                  <div className="text-[25px] text-white mr-1">
                    {card?.likes_count}
                  </div>
                  <div
                    className={`text-[35px]  cursor-pointer ${card?.liked_by_user ? "text-red-500" : "text-white"}`}
                    onClick={async () => {
                      if (!token) return alert("Log in to leave a like");
                      if (!card?.id) return;

                      const previousLiked = card.liked_by_user;

                      setCard((prev) => {
                        if (!prev) return prev;
                        const wasLiked = prev.liked_by_user;
                        return {
                          ...prev,
                          liked_by_user: !wasLiked,
                          likes_count: wasLiked
                            ? prev.likes_count - 1
                            : prev.likes_count + 1,
                        };
                      });

                      const res = await toggleLike(token, card.id);

                      if (!res) {
                        setCard((prev) =>
                          prev
                            ? {
                                ...prev,
                                liked_by_user: previousLiked,
                                likes_count: previousLiked
                                  ? prev.likes_count + 1
                                  : prev.likes_count - 1,
                              }
                            : prev,
                        );
                      }
                    }}
                  >
                    {card?.liked_by_user ? <IoIosHeart /> : <IoIosHeartEmpty />}
                  </div>
                </div>
                <div
                  className=" flex items-center  justify-around  text-white cursor-pointer select-none "
                  onClick={() => {
                    if (token) {
                      fetchCommentsLogged();
                    } else {
                      fetchComments();
                    }
                    setShowComments((prev) => !prev);
                  }}
                >
                  <div className="text-[25px] mr-1">{card?.comments_count}</div>
                  <FaRegCommentDots className=" text-[31px]  " />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        style={{ display: delModal ? "flex" : "none" }}
        className=" flex items-center justify-center w-full h-screen fixed bg-black/60 top-0 left-0 z-30"
        onMouseDown={(e) => {
          e.stopPropagation();
          setDelModal(false);
        }}
      >
        <div
          onMouseDown={(e) => e.stopPropagation()}
          className="bg-white [&>button]:p-3 [&>button]:pl-7 [&>button]:pr-7 flex flex-col w-80 rounded-3xl overflow-hidden [&>button]:cursor-pointer"
        >
          <button
            className="text-red-500 border-b border-zinc-300"
            onClick={deleteComment}
          >
            Delete
          </button>
          <button onClick={() => setDelModal(false)}>Cancel</button>
        </div>
      </div>
      <Comments
        showComments={showComments}
        id={id}
        commentSection={commentSection}
        fetchCommentsLogged={fetchCommentsLogged}
        setDelModal={setDelModal}
        setCommentId={setCommentId}
      />
    </div>
  );
};

export default CardPage;
