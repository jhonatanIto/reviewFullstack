import { useNavigate } from "react-router-dom";
import { useUser } from "../context/useUser";
import naruto from "../images/naruto.jpg";
import { CiLogout } from "react-icons/ci";

const Profile = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  return (
    <div className="flex justify-center">
      <div className="bg-white w-275 rounded-2xl shadow-white/30 shadow-lg p-5">
        <div className="flex justify-between">
          <div className="flex items-center">
            <img src={naruto} className="w-50 h-50 rounded-full object-cover" />
            <div className="text-2xl ml-10">
              <div className="text-[40px]">{user?.name}</div>
              <div className="text-zinc-500">Email: {user?.email}</div>
            </div>
          </div>
          <div>
            <div
              className="flex justify-between w-35 items-center border text-zinc-500
             text-[20px] p-1 pl-4 pr-4 rounded-2xl mt-[100%] cursor-pointer hover:text-red-500 transition-all duration-200"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              <CiLogout className="text-[25px]" />
              Logout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
