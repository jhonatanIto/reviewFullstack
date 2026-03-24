import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../context/useUser";
import { IoIosSend } from "react-icons/io";
import { backend, getFollowing } from "../utils/fetchData";
import { useEffect, useState } from "react";
import userpic from "../images/user.png";
import { timeAgo } from "../utils/calc";
import { SlArrowLeft } from "react-icons/sl";
import { GoDotFill } from "react-icons/go";

interface friend {
  id: number;
  name: string;
  picture: string | null;
  unique_id: string;
}

interface ChatData {
  chatId: number;
  messages: Messages[];
  users: friend[];
}

interface Messages {
  chat_id: number;
  content: string;
  created_at: string;
  sender_id: number;
  id: number;
}

interface Chatlist {
  chatId: number;
  lastMessage: string;
  lastMessageAt: string;
  name: string;
  picture: string;
  unique_id: string;
  unreadCount: number;
  userId: number;
}
interface Following {
  name: string;
  picture: string | null;
  reviews: number;
  unique_id: string;
}

const ChatPage = () => {
  const { user, token, setUnread } = useUser();
  const { unique } = useParams();
  const [chatData, setChatData] = useState<ChatData>();
  const [chatList, setChatList] = useState<Chatlist[]>();
  const [friend, setFriend] = useState<friend | undefined>();
  const [messageList, setMessageList] = useState<Messages[]>([]);
  const [message, setMessage] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [following, setFollowing] = useState<Following[]>([]);
  const navigate = useNavigate();

  const getChatData = async () => {
    try {
      if (!token) return;
      if (!unique) return;
      const res = await fetch(`${backend}/api/chat/info/${unique}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      const data: ChatData = await res.json();

      setChatData(data);
      setFriend(() => {
        return data.users.find((u) => u.id !== user?.id);
      });
      setMessageList(() => data.messages);
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = async () => {
    try {
      if (!token || !unique) return;

      const res = await fetch(`${backend}/api/chat/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message, chatId: chatData?.chatId }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getChatList = async () => {
    try {
      if (!token) return;
      const res = await fetch(`${backend}/api/chat/chatList`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }
      const isUnread = data.some((d) => {
        const count = Number(d.unreadCount);
        return count > 0;
      });
      setUnread(isUnread);
      setChatList(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getChatList();
  }, [token]);

  useEffect(() => {
    getChatData();
  }, [unique, token, user]);

  useEffect(() => {
    const fetchFollowing = async () => {
      if (!token) return;
      const data = await getFollowing(token);
      setFollowing(data.following);
    };
    fetchFollowing();
  }, [token]);

  useEffect(() => {
    if (unique) {
      setShowChat(true);
    } else {
      setShowChat(false);
    }
  }, [unique]);

  return (
    <div className="w-full md:h-full  flex md:justify-center md:items-center">
      <div className="bg-white flex h-full  md:h-[70vh] w-full md:w-[60%] md:mt-20 md:rounded-2xl overflow-hidden">
        <div
          className={`${showChat ? "hidden md:block" : ""} md:w-[50%] w-full overflow-y-scroll no-scrollbarChat  `}
        >
          {" "}
          {chatList?.length === 0 && (
            <div className="text-2xl text-center bg-zinc-900 text-white md:bg-white md:text-black md:mt-10">
              Your Chat list will appear here
            </div>
          )}
          {chatList?.map((c) => {
            return (
              <div
                className="flex hover:bg-zinc-100 p-3  cursor-pointer select-none transition-all duration-100"
                onClick={() => {
                  navigate(`/chat/${c.unique_id}`);
                  setShowChat(true);
                }}
              >
                <img
                  draggable={false}
                  src={c?.picture ?? userpic}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover cursor-pointer bg-zinc-600"
                />
                <div className="ml-3 min-w-0 flex flex-col justify-center">
                  <div className="font-semibold mb-1">{c?.name}</div>
                  <div className="flex">
                    <div
                      className={`text-[14px] truncate  ${c.unreadCount > 0 ? "font-semibold text-black" : "text-zinc-500"}`}
                    >
                      {c.lastMessage}
                    </div>
                    <div className="ml-2 text-[14px] text-zinc-500">
                      {c.lastMessageAt ? timeAgo(c.lastMessageAt) : ""}
                    </div>
                  </div>
                </div>
                {c.unreadCount > 0 && (
                  <div className=" flex  items-center ml-auto text-red-600 font-semibold">
                    <GoDotFill />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div
          className={`${!showChat ? "hidden" : ""} ${!unique ? "items-center " : "justify-between"}   md:flex flex-col  w-full
            border-l border-zinc-300`}
        >
          <div className={`${unique ? "hidden" : ""}`}>
            {following?.length === 0 && (
              <div className="mt-20 text-2xl">
                Chat will appear here after you send or receive a message
              </div>
            )}
            {following.length > 0 && (
              <div>
                <div className="text-2xl mt-20">Send a message to a friend</div>
                <div className="flex justify-start mt-3">Suggested:</div>
                <div className="overflow-scroll">
                  {following?.map((f) => {
                    return (
                      <div
                        key={f.unique_id}
                        className="mt-3 flex hover:bg-zinc-100 p-2 cursor-pointer"
                        onClick={() => navigate(`/chat/${f.unique_id}`)}
                      >
                        <img
                          src={f.picture ?? userpic}
                          className="w-11 h-11 rounded-full object-cover cursor-pointer bg-zinc-600"
                        />
                        <div className="ml-3 flex items-center font-semibold">
                          {f.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div
            className={`border-b border-zinc-300 p-2 ${!unique ? "hidden" : ""}`}
          >
            <div className="flex  items-center">
              <SlArrowLeft
                className="md:hidden mr-5 ml-3 text-2xl"
                onClick={() => setShowChat(false)}
              />
              <img
                src={friend?.picture ?? userpic}
                className="w-11 h-11 rounded-full object-cover cursor-pointer bg-zinc-600"
                onClick={() => navigate(`/profile/${friend?.unique_id}`)}
              />
              <div className="ml-3">{friend?.name}</div>
            </div>
          </div>
          <div
            className={`${!unique ? "hidden" : ""} flex flex-col justify-between w-full h-[80vh] md:h-full p-4 border-zinc-300`}
          >
            <ul className="relative  h-full overflow-y-scroll no-scrollbarChat">
              {messageList.map((m) => (
                <li
                  className={`flex ${m.sender_id !== user?.id ? "justify-start" : "justify-end"} mt-1 items-center`}
                >
                  {m.sender_id !== user?.id && (
                    <img
                      src={friend?.picture ?? userpic}
                      className="w-7 h-7 rounded-full object-cover cursor-pointer bg-zinc-600"
                    />
                  )}
                  <p
                    className={`ml-3 ${m.sender_id !== user?.id ? "bg-zinc-100" : "bg-blue-600 text-white"}  rounded-2xl 
                    p-1 pl-3 pr-4 flex items-center max-w-[60%]`}
                  >
                    {m.content}
                  </p>
                </li>
              ))}
            </ul>
            <div className={`relative w-full ${!unique ? "hidden" : ""}`}>
              <input
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                placeholder="Message..."
                type="text"
                className="w-full border border-zinc-300 rounded-2xl p-2 pr-13 outline-none h-13"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendMessage();
                    setMessage("");
                  }
                }}
              />
              <IoIosSend
                onClick={() => {
                  sendMessage();
                  setMessage("");
                }}
                className="absolute right-4 text-[30px] top-4 cursor-pointer hover:text-purple-500 text-purple-600"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
