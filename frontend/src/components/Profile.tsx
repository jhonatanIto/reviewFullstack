import { useNavigate } from "react-router-dom";
import { useUser } from "../context/useUser";
import { CiLogout } from "react-icons/ci";
import { GrNotes } from "react-icons/gr";
import { FaUser } from "react-icons/fa";
import userpic from "../images/user.png";

const Profile = () => {
  const { user, logout, cards } = useUser();
  const navigate = useNavigate();

  return (
    <div className="flex justify-center flex-col items-center px-4">
      {/* PROFILE CARD */}
      <div className="bg-white w-full md:w-[1100px] rounded-2xl shadow-white/30 shadow-lg mt-6 md:mt-10 p-5 md:p-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          {/* USER INFO */}
          <div className="flex flex-col md:flex-row items-center md:items-center text-center md:text-left">
            <img
              src={user?.picture ?? userpic}
              className="w-32 h-32 md:w-50 md:h-50 rounded-full object-cover bg-zinc-600"
            />

            <div className="text-lg md:text-2xl md:ml-10 mt-4 md:mt-0">
              <div className="text-2xl md:text-[40px] font-semibold">
                {user?.name}
              </div>

              <div className="text-zinc-500 text-sm md:text-base">
                Email: {user?.email}
              </div>

              <div className="text-zinc-500 text-sm md:text-base">
                ID: {user?.unique_id}
              </div>
            </div>
          </div>

          <div className="flex justify-center md:block mt-6 md:mt-0">
            <div
              className="flex justify-center items-center gap-2 border text-zinc-500
            text-base md:text-[20px] p-2 px-4 rounded-xl cursor-pointer
            hover:text-red-500 transition-all duration-200"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              <CiLogout className="text-xl md:text-[25px]" />
              Logout
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-275 mt-8 select-none grid grid-cols-3 md:flex md:justify-start gap-6 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center text-white/70 text-sm md:text-2xl">
          <GrNotes className="text-3xl md:text-[50px]" />
          <div className="md:ml-3 mt-1 md:mt-0">Reviews: {cards.length}</div>
        </div>

        <div className="flex flex-col md:flex-row items-center text-white/70 text-sm md:text-2xl">
          <FaUser className="text-3xl md:text-[40px]" />
          <div className="md:ml-3 mt-1 md:mt-0">
            Following: {user?.following}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center text-white/70 text-sm md:text-2xl">
          <FaUser className="text-3xl md:text-[40px]" />
          <div className="md:ml-3 mt-1 md:mt-0">
            Followers: {user?.followers}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
