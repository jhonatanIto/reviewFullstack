import { useState } from "react";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { useUser } from "../context/useUser";
import type { CommentSection } from "./CardPage";
import { useNavigate } from "react-router-dom";
import userpic from "../images/user.png";
import { timeAgo } from "../utils/calc";
import { backend } from "../utils/fetchData";

interface CommentsProps {
  showComments: boolean;
  id: string | undefined;
  commentSection: CommentSection[];
  fetchCommentsLogged: () => void;
}

const Comments = ({
  showComments,
  id,
  commentSection,
  fetchCommentsLogged,
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
      className={`flex flex-col items-center bg-white/90  rounded-2xl overflow-hidden shadow-black shadow-lg absolute -right-95 h-full w-90
           ${showComments ? " translate-y-0 scale-100 pointer-events-auto" : "translate-y-10 scale-70 opacity-0 pointer-events-none"} transition-all duration-200 ease-in-out
           justify-between`}
    >
      <div className=" w-full h-full overflow-scroll">
        {commentSection.map((c) => {
          return (
            <div className="flex justify-between p-2 mt-1">
              <img
                src={c.picture ?? userpic}
                className="w-13 h-13 rounded-full object-cover cursor-pointer bg-zinc-600 "
                onClick={() => navigate(`/profile/${c.unique_id}`)}
              />
              <div className="  flex items-center w-full justify-between ml-3 ">
                <div>
                  <div className="flex  items-center">
                    <div className="font-bold">{c.name}</div>
                    <div className="text-zinc-600 text-[13px] ml-2">
                      {timeAgo(c.created_at)}
                    </div>
                  </div>
                  <div className="text-[15px] font-sans">
                    <div>{c.comment}</div>
                  </div>
                </div>
                <div
                  className={`font-semibold  ml-2 cursor-pointer hover:text-red-500 transition-all flex flex-col  items-center
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
            value={comment}
            type="text"
            placeholder="Add a comment"
            className="w-full outline-none"
            onChange={(e) => setComment(e.target.value)}
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
