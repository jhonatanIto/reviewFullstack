import { useNavigate } from "react-router-dom";
import { useUser } from "../context/useUser";
import { CiLogout } from "react-icons/ci";
import { GrNotes } from "react-icons/gr";
import { FaUser } from "react-icons/fa";
import userpic from "../images/user.png";
import { useState } from "react";
import { backend } from "../utils/fetchData";

import useNotification from "../hooks/useNotification";

const Profile = () => {
  const { user, logout, cards } = useUser();
  const navigate = useNavigate();
  const [pictureModal, setPictureModal] = useState(false);

  return (
    <div className="flex justify-center flex-col items-center px-4">
      <PictureModal
        pictureModal={pictureModal}
        setPictureModal={setPictureModal}
      />
      <div className="bg-white w-full md:w-275 rounded-2xl shadow-white/30 shadow-lg mt-6 md:mt-10 p-5 md:p-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="flex flex-col md:flex-row items-center md:items-center text-center md:text-left">
            <img
              src={user?.picture ?? userpic}
              className="w-32 h-32 md:w-50 md:h-50 rounded-full object-cover bg-zinc-600 cursor-pointer"
              onClick={() => {
                setPictureModal(true);
              }}
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

interface PictureModalProps {
  pictureModal: boolean;
  setPictureModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const PictureModal = ({ pictureModal, setPictureModal }: PictureModalProps) => {
  const { user, setUser, token, setLoading } = useUser();
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [saveChange, setSaveChange] = useState(false);

  const { errorNotification } = useNotification();

  const savePicture = async () => {
    if (!preview) return;
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch(`${backend}/api/users/picture`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url: preview }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message);

      setUser((prev) => {
        if (!prev) return prev;
        const updateUser = { ...prev, picture: preview };
        localStorage.setItem("MyReview_user", JSON.stringify(updateUser));

        return updateUser;
      });
      setPictureModal(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const isValidImage = (url: string) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;

      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  };
  console.log(url);
  return (
    <div
      className={`${!pictureModal ? "hidden" : ""} flex justify-center w-full h-full fixed m-0 bg-black/65 top-0 z-50`}
      onMouseDown={() => {
        setPictureModal(false);
        setUrl("");
        setPreview("");
        setSaveChange(false);
      }}
    >
      <div
        className="md:w-125 w-[95%] h-fit pb-16 mt-40 flex flex-col rounded-2xl items-center bg-white "
        onMouseDown={(e) => e.stopPropagation()}
      >
        <img
          src={((preview || user?.picture) ?? undefined) || userpic}
          className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover bg-zinc-600 mt-10"
        />
        <div className="w-full">
          <div className="flex flex-col w-full items-center">
            <input
              onChange={(e) => setUrl(e.target.value)}
              value={url}
              type="text"
              placeholder="Url Image here "
              className="border border-zinc-300 p-1 pr-2 pl-2 mt-4 w-[60%]"
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  const valid = await isValidImage(url);

                  if (!valid) return errorNotification("Invalid url");

                  setPreview(url);
                  setUrl("");
                  setSaveChange(true);
                }
              }}
            />
            <button
              className={`border mt-4 w-[60%] p-1 rounded-[5px] text-white bg-blue-500 cursor-pointer ${!url && !saveChange ? "opacity-40 pointer-events-none cursor-default" : ""}`}
              onClick={async () => {
                if (saveChange) {
                  savePicture();
                } else {
                  const valid = await isValidImage(url);

                  if (!valid) return errorNotification("Invalid url");

                  setPreview(url);
                  setUrl("");
                  setSaveChange(true);
                }
              }}
            >
              {saveChange ? "Save change" : "Confirm Url"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
