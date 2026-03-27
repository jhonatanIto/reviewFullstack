import { useState } from "react";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { useUser } from "../context/useUser";
import type { CommentSection } from "./CardPage";
import { useNavigate } from "react-router-dom";
import userpic from "../images/user.png";
import { timeAgo } from "../utils/calc";
import { backend } from "../utils/fetchData";
import { HiDotsHorizontal } from "react-icons/hi";

interface CommentsProps {
  showComments: boolean;
  setDelModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCommentId: React.Dispatch<React.SetStateAction<number>>;
  id: string | undefined;
  commentSection: CommentSection[];
  fetchCommentsLogged: () => void;
}

const Comments = ({
  showComments,
  id,
  commentSection,
  fetchCommentsLogged,
  setDelModal,
  setCommentId,
}: CommentsProps) => {
  const [comment, setComment] = useState("");
  const { token, user } = useUser();
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  const postComment = async () => {
    if (comment.length < 1) return;
    try {
      setSending(true);
      const res = await fetch(`${backend}/api/cards/comment/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment }),
      });

      const data = await res.json();
      if (!res.ok) return console.log(data?.message);

      setComment("");
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const postLike = async (commId: number) => {
    try {
      const res = await fetch(`${backend}/api/cards/commentLike/${commId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) return data?.message;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      onMouseDown={(e) => e.stopPropagation()}
      className={`flex flex-col items-center absolute md:w-95 md:-right-98 md:h-full md:mb-6 bg-white top-0 rounded-2xl overflow-y-auto md:overflow-hidden shadow-black shadow-lg 
          h-[85%] w-full  ${showComments ? " translate-y-0 scale-100 pointer-events-auto" : "translate-y-60 md:-translate-x-20 scale-30 opacity-0 pointer-events-none"}
           transition-all duration-200 ease-in-out `}
    >
      <div className=" w-full h-full overflow-scroll">
        {commentSection.map((c) => {
          return (
            <div className="flex justify-between p-2 mt-1 group ">
              <img
                src={c.picture ?? userpic}
                className="w-13 h-13 rounded-full object-cover cursor-pointer bg-zinc-600 "
                onClick={() => navigate(`/profile/${c.unique_id}`)}
              />
              <div className="  flex items-center w-full justify-between ml-3  ">
                <div className=" max-w-[82%] wrap-break-word">
                  <div className="flex  items-center ">
                    <div className="font-bold">{c.name}</div>
                    <div className="text-zinc-600 text-[13px] ml-2">
                      {timeAgo(c.created_at)}
                    </div>
                    {c.isOwner && (
                      <div
                        className={`opacity-0 ml-2 text-zinc-600 group-hover:opacity-100 cursor-pointer`}
                        onClick={() => {
                          setDelModal(true);
                          setCommentId(c.id);
                        }}
                      >
                        <HiDotsHorizontal />
                      </div>
                    )}
                  </div>
                  <div className="text-[15px] font-sans  ">
                    <div>{c.comment}</div>
                  </div>
                </div>
                <div
                  className={`font-semibold  cursor-pointer hover:text-red-500 transition-all flex flex-col  items-center  
                     duration-150 ${c.isLiked ? "text-red-500" : "text-zinc-500"}`}
                  onClick={async () => {
                    await postLike(c.id);
                    await fetchCommentsLogged();
                  }}
                >
                  <div>{c.isLiked ? <IoIosHeart /> : <IoIosHeartEmpty />}</div>
                  <div
                    className={`text-zinc-600 text-[13px]    font-semibold ${c.likes > 0 ? "opacity-100" : "opacity-0"}`}
                  >
                    {c.likes}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex border-t border-black/10 justify-between p-2 w-full">
        <img
          src={user?.picture || userpic}
          className="w-13 h-13 rounded-full object-cover cursor-pointer bg-zinc-600"
        />
        <div className="  flex items-center w-full justify-between ml-3 ">
          <input
            disabled={sending}
            value={comment}
            type="text"
            placeholder="Add a comment"
            className="w-full outline-none"
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                await postComment();
                await fetchCommentsLogged();
              }
            }}
          />
          <button
            disabled={sending}
            className="font-semibold text-purple-500 ml-2 cursor-pointer"
            onClick={async () => {
              await postComment();
              await fetchCommentsLogged();
            }}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default Comments;
