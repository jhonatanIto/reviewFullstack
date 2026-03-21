import { useEffect, useState } from "react";
import { backend, toggleFollow } from "../utils/fetchData";
import { timeAgo } from "../utils/calc";
import { useNavigate } from "react-router-dom";
import userpic from "../images/user.png";

interface NotificationProps {
  token: string | null;
  showNoti: boolean;
}
interface Notification {
  card_id: number;
  comment_id: number | null;
  created_at: string;
  from_user: {
    unique_id: string;
    name: string;
    picture: string;
  };
  id: number;
  is_read: number;
  type: string;
  card_picture: string;
  isFollowing: boolean;
}

const Notification = ({ token, showNoti }: NotificationProps) => {
  const [notiData, setNotiData] = useState<Notification[]>([]);
  const navigate = useNavigate();
  const [loadingNoti, setLoadingNoti] = useState(false);

  const getNotification = async () => {
    try {
      setLoadingNoti(true);
      const res = await fetch(`${backend}/api/notification`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.message);

      setNotiData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingNoti(false);
    }
  };

  useEffect(() => {
    getNotification();
  }, [token]);

  return (
    <div
      className={`${showNoti ? "block" : "hidden"} absolute right-0 z-30 top-12 bg-white text-black border w-100 rounded-2xl text-[15px] p-2`}
    >
      {notiData.map((n) => (
        <div className="mt-2 flex items-center">
          <img
            className="w-12 h-12 md:w-12 md:h-12 rounded-full bg-zinc-600 object-cover cursor-pointer group-hover:scale-110 "
            src={n.from_user.picture || userpic}
            onClick={() => navigate(`/profile/${n.from_user.unique_id}`)}
          />
          <div className=" flex ml-4  w-50 wrap-break-word">
            <div>
              <span className="font-bold">{n.from_user.name}</span>{" "}
              {n.type === "FOLLOW"
                ? "started following you."
                : n.type === "LIKE"
                  ? "liked your review."
                  : n.type === "COMMENT"
                    ? "commented on your post"
                    : ""}
              <span className="text-zinc-500"> {timeAgo(n.created_at)}</span>
            </div>
          </div>
          {n.type === "FOLLOW" ? (
            <button
              disabled={loadingNoti}
              className={`${n.isFollowing ? "text-black bg-zinc-200" : "bg-blue-600 text-white"} ml-14  font-semibold
              pl-2 pr-2 p-1 rounded-[5px] w-29 flex items-center justify-center cursor-pointer`}
              onClick={async () => {
                if (!token) return;
                await toggleFollow(n.from_user.unique_id, token);
                await getNotification();
              }}
            >
              {n.isFollowing ? "Following" : "Follow back"}
            </button>
          ) : (
            <div>
              <img
                className="w-12 md:w-12 md:h-12 object-cover cursor-pointer ml-14 "
                src={n.card_picture}
                onClick={() =>
                  navigate(`/${n.from_user.unique_id}/${n.card_id}`)
                }
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Notification;
