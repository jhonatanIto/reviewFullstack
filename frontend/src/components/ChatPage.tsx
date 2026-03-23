import { useParams } from "react-router-dom";
import { useUser } from "../context/useUser";
import { IoIosSend } from "react-icons/io";
import { backend } from "../utils/fetchData";
import { useEffect } from "react";

const ChatPage = () => {
  const { user } = useUser();
  const { unique } = useParams();

  const getChatData = async () => {
    try {
      const res = await fetch(`${backend}/api/chat/info/${unique}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message);
      }

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getChatData();
  }, []);

  return (
    <div className="w-full flex justify-center items-center">
      <div className="bg-white flex h-[70vh] w-[60%] mt-20 rounded-2xl overflow-hidden">
        <div className="w-[50%]">
          <div className="flex hover:bg-zinc-100 p-3 cursor-pointer select-none transition-all duration-100">
            <img
              draggable={false}
              src={user?.picture}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover cursor-pointer bg-zinc-600"
            />
            <div className="ml-3 min-w-0 flex flex-col justify-center">
              <div className="font-semibold mb-1">{user?.name}</div>
              <div className="flex">
                <div className="text-[14px] truncate text-zinc-500">
                  varias mensagens aqui de uma conversa
                </div>
                <div className="ml-2 text-[14px] text-zinc-500">3h</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between w-full  border-l border-zinc-300">
          <div className="border-b border-zinc-300 p-2">
            <div className="flex  items-center">
              <img
                src={user?.picture}
                className="w-11 h-11 rounded-full object-cover cursor-pointer bg-zinc-600"
              />
              <div className="ml-3">{user?.name}</div>
            </div>
          </div>
          <div className="flex flex-col justify-between w-full  h-full p-4 border-zinc-300">
            <ul className="relative  h-full">
              <li className="flex justify-start  items-center">
                <img
                  src={user?.picture}
                  className="w-7 h-7 rounded-full object-cover cursor-pointer bg-zinc-600"
                />
                <p className="ml-3 bg-zinc-100 rounded-2xl p-1 pl-3 pr-4 flex items-center max-w-[60%]">
                  some message here
                </p>
              </li>
              <li className="flex justify-end">
                <p className="ml-3 w-fit bg-blue-600 text-white rounded-2xl p-1 pl-3 pr-4 flex items-center max-w-[60%]">
                  some message here
                </p>
              </li>
            </ul>
            <div className="relative w-full ">
              <input
                placeholder="Message..."
                type="text"
                className="w-full border border-zinc-300 rounded-2xl p-2 pr-13 outline-none h-13"
              />
              <IoIosSend className="absolute right-4 text-[30px] top-4 cursor-pointer hover:text-purple-500 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
