import { useUser } from "../context/useUser";
import { IoIosSend } from "react-icons/io";

const ChatPage = () => {
  const { user } = useUser();
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
        <div className="flex flex-col justify-between w-full p-4 border-l border-zinc-300">
          <ul className="relative">
            <li className="flex justify-start">
              <img
                src={user?.picture}
                className="w-10 h-10 rounded-full object-cover cursor-pointer bg-zinc-600"
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
  );
};

export default ChatPage;
