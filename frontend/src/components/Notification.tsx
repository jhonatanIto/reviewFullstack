import { useEffect, useState } from "react";
import { backend } from "../utils/fetchData";
import { timeAgo } from "../utils/calc";

interface NotificationProps {
  token: string | null;
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
}

const Notification = ({ token }: NotificationProps) => {
  const [notiData, setNotiData] = useState<Notification[]>([]);

  const getNotification = async () => {
    try {
      const res = await fetch(`${backend}/api/notification`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) return console.log(data?.message);

      setNotiData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getNotification();
  }, [token]);

  console.log(notiData);
  return (
    <div className="hidden absolute right-0 z-30 top-12 bg-white text-black border w-100 rounded-2xl text-[15px] p-2">
      {notiData.map((n) => (
        <div className="mt-2 flex items-center">
          <img
            className="w-12 h-12 md:w-12 md:h-12 rounded-full object-cover cursor-pointer group-hover:scale-110 "
            src={n.from_user.picture}
          />
          <div className=" flex ml-4  w-50 wrap-break-word">
            <div>
              <span className="font-bold">{n.from_user.name}</span>{" "}
              {n.type === "FOLLOW"
                ? "started following you."
                : n.type === "LIKE"
                  ? "liked your review."
                  : ""}
              <span className="text-zinc-500"> {timeAgo(n.created_at)}</span>
            </div>
          </div>
          {n.type === "FOLLOW" && (
            <div className="ml-14 bg-blue-600 text-white pl-2 pr-2 p-1 rounded-[5px] w-23 flex items-center justify-center">
              follow
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Notification;
