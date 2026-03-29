import { toggleFollow } from "../utils/fetchData";
import { timeAgo } from "../utils/calc";
import { useNavigate } from "react-router-dom";
import userpic from "../images/user.png";
import type { Notification } from "./Header";
import { useUser } from "../context/useUser";

interface NotificationProps {
  showNoti: boolean;
  setShowNoti: React.Dispatch<React.SetStateAction<boolean>>;
  notiData: Notification[];
  loadingNoti: boolean;
  getNotification: () => void;
}

const NotificationList = ({
  showNoti,
  notiData,
  loadingNoti,
  setShowNoti,
  getNotification,
}: NotificationProps) => {
  const navigate = useNavigate();

  const { token } = useUser();

  return (
    <div
      className={`${showNoti ? "block" : "hidden"} absolute right-0 z-30 top-12 bg-white text-black border md:w-100 w-full 
       rounded-2xl text-[15px] p-2 max-h-120  overflow-scroll no-scrollbarChat  `}
    >
      {notiData.length === 0 && (
        <div className="p-2">No notifications yet.</div>
      )}
      {notiData.map((n) => (
        <div className="mt-2 flex items-center">
          <img
            className="w-12 h-12 md:w-12 md:h-12 rounded-full bg-zinc-600 object-cover cursor-pointer group-hover:scale-110 "
            src={n.from_user.picture || userpic}
            onClick={() => {
              navigate(`/profile/${n.from_user.unique_id}`);
              setShowNoti(false);
            }}
          />
          <div className=" flex ml-4  w-50 wrap-break-word ">
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
              pl-2 pr-2 p-1 rounded-[5px] w-41 flex items-center justify-center cursor-pointer`}
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
                className="w-12 md:w-12 md:h-12 object-cover cursor-pointer md:ml-14 ml-5"
                src={n.card_picture}
                onClick={() => {
                  navigate(`/${n.from_user.unique_id}/${n.card_id}`);
                  setShowNoti(false);
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
