import { useState } from "react";
import naruto from "../images/naruto.jpg";
import { IoIosHeartEmpty } from "react-icons/io";
import { useUser } from "../context/useUser";
import type { CommentSection } from "./CardPage";
import { useNavigate } from "react-router-dom";
import userpic from "../images/user.png";

interface CommentsProps {
  showComments: boolean;
  id: string | undefined;
  commentSection: CommentSection[];
  fetchComments: () => void;
}

const Comments = ({
  showComments,
  id,
  commentSection,
  fetchComments,
}: CommentsProps) => {
  const [comment, setComment] = useState("");
  const { token, user } = useUser();
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();
  const postComment = async () => {
    if (comment.length < 1) return;
    try {
      setSending(true);
      const res = await fetch(`http://localhost:3000/api/cards/comment/${id}`, {
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
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  };
  console.log(commentSection);

  return (
    <div
      className={`flex flex-col items-center bg-white/90  rounded-2xl overflow-hidden shadow-black shadow-lg absolute -right-95 h-full w-90
           ${showComments ? " translate-y-0 scale-100 pointer-events-auto" : "translate-y-10 scale-70 opacity-0 pointer-events-none"} transition-all duration-200 ease-in-out
           justify-between`}
    >
      <div className=" w-full h-full overflow-scroll">
        {commentSection.map((c) => {
          return (
            <div className="flex justify-between p-2 ">
              <img
                src={c.picture ?? userpic}
                className="w-13 h-13 rounded-full object-cover cursor-pointer bg-zinc-600 "
                onClick={() => navigate(`/profile/${c.unique_id}`)}
              />
              <div className="  flex items-center w-full justify-between ml-3 ">
                <div>
                  <div className="font-bold">{c.name}</div>
                  <div className="text-[15px] font-sans">
                    <div>{c.comment}</div>
                    <div className="text-zinc-600 text-[13px]">1 like</div>
                  </div>
                </div>
                <div className="font-semibold text-zinc-500 ml-2 cursor-pointer hover:text-red-500 transition-all duration-150">
                  <IoIosHeartEmpty />
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
              await fetchComments();
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
