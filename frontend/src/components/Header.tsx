import { IoSearchOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { backend, fetchMovies, searchMovies } from "../utils/fetchData";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/useUser";
import { useMovie } from "../context/useMovie";
import type { Movie } from "../context/MovieContext";
import userpic from "../images/user.png";
import { BsLightbulbFill } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import NotificationList from "./NotificationList";
import { BsChatDotsFill } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";
import type { Chatlist } from "./ChatPage";

type GalleryOption = "Watch list" | "Reviews";

export interface Notification {
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

const routes = {
  "Watch list": "watchlist",
  Reviews: "reviews",
};

const Header = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const mobInput = useRef<HTMLInputElement>(null);

  const location = useLocation().pathname;
  const navigate = useNavigate();

  const [galleryList, setGalleryList] = useState<boolean>(false);
  const [selectedGallery, setSelectedGallery] =
    useState<GalleryOption>("Reviews");
  const galleryRef = useRef<HTMLLIElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const humbRef = useRef<HTMLDivElement>(null);
  const notiRef = useRef<HTMLDivElement>(null);
  const notiMobile = useRef<HTMLDivElement>(null);

  const [showNoti, setShowNoti] = useState(false);
  const [notiCount, setNotiCount] = useState(0);
  const [loadingNoti, setLoadingNoti] = useState(false);

  const {
    user,
    setShowWatch,
    search,
    setSearch,
    typeRef,
    setDisplayInput,
    displayInput,
    searchUserRes,
    token,
    notiData,
    setNotiData,
    unread,
    setUnread,
  } = useUser();
  const { setMovies } = useMovie();

  useEffect(() => {
    const closeNoti = (e: MouseEvent) => {
      if (
        notiRef.current &&
        !notiRef.current.contains(e.target as Node) &&
        notiMobile.current &&
        !notiMobile.current.contains(e.target as Node)
      ) {
        setShowNoti(false);
      }
    };

    document.addEventListener("mousedown", closeNoti);
    return () => document.removeEventListener("mousedown", closeNoti);
  }, []);
  const getNotification = async () => {
    if (!token) return;
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

  const getChatList = async () => {
    try {
      if (!token) return;
      const res = await fetch(`${backend}/api/chat/chatList`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }

      const data: Chatlist[] = await res.json();

      const isUnread = data.some((d) => {
        const count = Number(d.unreadCount);
        return count > 0;
      });
      setUnread(isUnread);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getChatList();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    getNotification();
  }, [token]);

  useEffect(() => {
    setNotiCount(() => {
      const count = notiData.filter((n) => n.is_read === 0);

      return count.length;
    });
  }, [notiData]);

  useEffect(() => {
    const closeInput = (e: MouseEvent) => {
      if (
        inputRef.current &&
        mobInput.current &&
        !inputRef.current?.contains(e.target as Node) &&
        !mobInput.current?.contains(e.target as Node) &&
        !typeRef.current?.contains(e.target as Node) &&
        !searchUserRes.current?.contains(e.target as Node)
      ) {
        setDisplayInput(false);
        setSearch("");
      }
    };

    const closeGallery = (e: MouseEvent) => {
      if (galleryRef && !galleryRef.current?.contains(e.target as Node)) {
        setGalleryList(false);
      }
    };

    document.addEventListener("mousedown", closeInput);
    document.addEventListener("mouseover", closeGallery);

    return () => {
      document.removeEventListener("mousedown", closeInput);
      document.removeEventListener("mouseover", closeGallery);
    };
  }, []);
  useEffect(() => {
    const mobileMenuHandler = (e: MouseEvent) => {
      if (
        menuRef.current &&
        humbRef.current &&
        !humbRef.current.contains(e.target as Node) &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", mobileMenuHandler);
    return () => document.removeEventListener("click", mobileMenuHandler);
  }, []);

  useEffect(() => {
    if (location !== "/") return;
    const inputValue = search.trim();
    if (inputValue.length <= 1) return;

    const timeout = setTimeout(async () => {
      const data = await searchMovies(inputValue);

      const convMovies = data.map((c: Movie) => {
        return {
          original_title: c.original_title,
          poster_path: c.poster_path,
          overview: c.overview,
          release_date: c.release_date,
          id: c.id,
          backdrop_path: c.backdrop_path,
        };
      });

      setMovies(convMovies);
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    const loadMovies = async () => {
      const data = await fetchMovies();

      const convMovies = data.map((c: Movie) => {
        const convPoster = `https://image.tmdb.org/t/p/w500${c.poster_path}`;
        const convBanner = `https://image.tmdb.org/t/p/original${c.backdrop_path}`;

        return {
          original_title: c.original_title,
          poster_path: convPoster,
          overview: c.overview,
          release_date: c.release_date,
          id: c.id,
          backdrop_path: convBanner,
        };
      });
      setMovies(convMovies);
    };

    loadMovies();
  }, []);

  useEffect(() => {
    if (selectedGallery === "Watch list") {
      setShowWatch(true);
    } else {
      setShowWatch(false);
    }
  }, [selectedGallery]);

  const handleGalleryChange = (option: GalleryOption) => {
    setGalleryList(false);
    setSelectedGallery(option);
    navigate(`/${routes[option]}`);
  };

  const markAllRead = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${backend}/api/notification/read-all`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.message);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="flex flex-col md:flex-row w-full justify-between items-center text-white text-[18px] md:text-[26px] 
    px-4 md:px-10 pt-6 md:pt-10 relative"
    >
      <div
        className={`flex md:hidden w-full justify-between relative items-center px-2 `}
      >
        <div className={`${showNoti ? "block " : "hidden"}`} ref={notiMobile}>
          <NotificationList
            notiData={notiData}
            showNoti={showNoti}
            setShowNoti={setShowNoti}
            loadingNoti={loadingNoti}
            getNotification={getNotification}
          />
        </div>

        <div
          className={`text-purple-500 cursor-pointer flex items-center transition-all duration-300 ${showNoti ? "absolute" : ""}
             ${displayInput ? "opacity-0! pointer-events-none!" : "opacity-100"}`}
          onClick={() => {
            navigate("/");
            window.location.reload();
          }}
        >
          <span className="bg-purple-600  rounded px-2 py-0.5 text-white mr-2 ">
            MY
          </span>
          REVIEW
        </div>
        <div className="flex items-center relative  ">
          <input
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            ref={mobInput}
            style={{
              opacity: displayInput ? 1 : 0,
              pointerEvents: displayInput ? "auto" : "none",
              maxWidth: displayInput
                ? window.innerWidth < 640
                  ? "210px"
                  : "260px"
                : "0px",
              minWidth: displayInput
                ? window.innerWidth < 640
                  ? "210px"
                  : "260px"
                : "0px",
            }}
            type="text"
            className="bg-white text-black text-[18px] py-1 outline-none pl-2 transition-all 
            ease-in-out duration-400 rounded-sm absolute right-21"
            placeholder="Search..."
          />

          <IoSearchOutline
            onClick={() => {
              setDisplayInput(true);
              mobInput.current?.focus();
            }}
            className="text-[28px] cursor-pointer hover:text-purple-500 transition-all duration-200 mr-4"
          />

          <div
            ref={humbRef}
            onClick={() => setMenuOpen(!menuOpen)}
            className="cursor-pointer text-[35px]"
          >
            ☰
          </div>
        </div>
      </div>
      <div
        className="hidden  md:ml-[3%] w-auto justify-between items-center md:flex text-purple-500 cursor-pointer select-none mb-3 md:mb-0 "
        onClick={() => {
          navigate("/");
          window.location.reload();
        }}
      >
        <span className="bg-purple-600 rounded-[5px] px-2 py-0.5 flex items-center justify-center text-white mr-2">
          MY
        </span>{" "}
        REVIEW
      </div>
      <div
        ref={menuRef}
        className={`md:hidden fixed top-0 right-0 h-screen w-[65%] max-w-75 bg-black/50 z-50 backdrop-blur-[25px]
                flex flex-col justify-between transition-transform duration-300 ease-in-out text-white
                ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="pl-6 pt-10 [&>div]:p-4 text-2xl select-none  [&>div]:w-fit">
          <RxCross1 className="text-3xl" onClick={() => setMenuOpen(false)} />
          <div
            className="mt-8  "
            onClick={() => {
              navigate("/");
              setMenuOpen(false);
            }}
          >
            Home
          </div>
          <div
            onClick={() => {
              if (user) {
                navigate("/reviews");
                handleGalleryChange("Reviews");
              } else {
                navigate("/login");
              }
              setMenuOpen(false);
            }}
          >
            Review
          </div>
          <div
            onClick={() => {
              if (user) {
                navigate("/watchlist");
                handleGalleryChange("Watch list");
              } else {
                navigate("/login");
              }

              setMenuOpen(false);
            }}
          >
            Watch list
          </div>
          <div
            onClick={() => {
              if (user) {
                navigate("/friends");
              } else {
                navigate("/login");
              }

              setMenuOpen(false);
            }}
          >
            Friends
          </div>
          <div
            className="flex  items-center"
            onClick={async () => {
              if (user) {
                setShowNoti(true);
                setMenuOpen(false);
                await markAllRead();
                await getNotification();
              } else {
                navigate("/login");
              }

              setMenuOpen(false);
            }}
          >
            Notifications{" "}
            <div className="ml-2 mt-1 text-red-600 pointer-events-none text-[22px]  font-semibold">
              {notiCount > 0 ? notiCount : ""}
            </div>
          </div>
          <div
            className={`${!user ? "hidden" : ""} flex items-center `}
            onClick={() => {
              if (user) {
                navigate("/chat");
              } else {
                navigate("/login");
              }

              setMenuOpen(false);
            }}
          >
            Chat
            {unread && !location.startsWith("/chat") && (
              <GoDotFill className=" text-[20px] text-red-500  ml-3 mt-1" />
            )}
          </div>
          <div
            className={`${user ? "hidden" : ""}`}
            onClick={() => {
              navigate("/login");
              setMenuOpen(false);
            }}
          >
            Login
          </div>
        </div>
        <div
          className={`ml-6 mb-5 cursor-pointer hover:text-purple-500 transition-all duration-200
                   ${location === "/login" || location === "/profile" ? "text-purple-500" : ""}`}
          onClick={() => {
            navigate(user ? "/profile" : "/login");
            setMenuOpen(false);
          }}
        >
          {user ? (
            <img
              src={user.picture || userpic}
              className="rounded-full w-13 h-13 object-cover"
            />
          ) : (
            <FaUser className="text-[24px]" />
          )}
        </div>
      </div>

      <div
        className={`hidden md:flex mr-[4%]
          md:static md:flex-row md:bg-transparent md:w-auto`}
      >
        <ul className="flex  md:flex-row items-center md:gap-0  md:py-0">
          <div
            className={`flex md:gap-9 gap-4  transition-all  ease-in-out [&>li]:cursor-pointer md:mr-5 [&>li]:pb-2 md:[&>li]:mr-10
               [&>li]:hover:text-purple-500   [&>li]:transition-all [&>li]:duration-200 [&>li]:select-none  
  ${displayInput ? "max-w-0 opacity-0 pointer-events-none md:opacity-100 md:max-w-full" : "max-w-125 opacity-100 duration-1000 "}`}
          >
            {" "}
            <li
              className={`relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-purple-500 
                after:transition-all after:duration-300 ${location === "/" ? "after:w-full text-purple-500" : ""}`}
              onClick={() => navigate("/")}
            >
              <div>Home</div>
            </li>
            <li
              ref={galleryRef}
              className={`relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-purple-500
                 after:transition-all after:duration-300 flex justify-center
                  ${location === "/reviews" || location === "/watchlist" ? "after:w-full text-purple-500" : ""}`}
              onClick={() => {
                if (user) {
                  setGalleryList(false);
                  navigate(`/${routes[selectedGallery]}`);
                } else {
                  navigate("/login");
                }
              }}
              onMouseEnter={() => setGalleryList(true)}
            >
              <div>{selectedGallery}</div>
              <div
                style={{ display: galleryList ? "flex" : "none" }}
                className="absolute top-6 opacity-0 border w-full"
              >
                as
              </div>
              <div
                className={`absolute top-7 md:top-15 border-purple-500 z-50  w-32 flex flex-col items-center
                 text-white [&>div]:w-full text-center [&>div]:p-2 [&>div]:border-purple-500 [&>div]:text-[18px] md:[&>div]:text-[20px]
                  ${galleryList ? "translate-y-0 opacity-100 pointer-events-auto" : "-translate-y-5 opacity-0 pointer-events-none"}
                   transition-all duration-200 ease-in-out [&>div]:hover:bg-purple-500/30`}
              >
                {selectedGallery !== "Reviews" && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGalleryChange("Reviews");
                    }}
                  >
                    Reviews
                  </div>
                )}
                {selectedGallery !== "Watch list" && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGalleryChange("Watch list");
                    }}
                  >
                    Watch list
                  </div>
                )}
              </div>
            </li>
            <li
              className={`relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-purple-500
                 after:transition-all after:duration-300 ${location === "/friends" ? "after:w-full text-purple-500" : ""}`}
              onClick={() => {
                if (user) {
                  navigate("/friends");
                } else {
                  navigate("/login");
                }
                setMenuOpen(false);
              }}
            >
              <div>Friends</div>
            </li>{" "}
          </div>

          <div className="flex items-center">
            <input
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              ref={inputRef}
              style={{
                opacity: displayInput ? 1 : 0,
                pointerEvents: displayInput ? "auto" : "none",
                maxWidth: displayInput
                  ? window.innerWidth < 640
                    ? "210px"
                    : "260px"
                  : "0px",
                minWidth: displayInput
                  ? window.innerWidth < 640
                    ? "210px"
                    : "260px"
                  : "0px",
              }}
              type="text"
              className="bg-white hidden md:block text-black text-[18px] py-1 outline-none pl-2 transition-all ease-in-out duration-400 rounded-sm "
              placeholder="Search..."
            />

            <div className="flex items-center ml-2">
              {!displayInput && (
                <div className="mr-4 opacity-50 hidden md:block">|</div>
              )}
              <IoSearchOutline
                onClick={() => {
                  setDisplayInput(true);
                  inputRef.current?.focus();
                }}
                className="text-[28px] cursor-pointer hover:text-purple-500 transition-all duration-200 hidden md:block"
              />
              <div
                className={`ml-4 cursor-pointer hover:text-purple-500 transition-all duration-200
                   ${location === "/login" || location === "/profile" ? "text-purple-500" : ""}`}
                onClick={() => {
                  navigate(user ? "/profile" : "/login");
                  setMenuOpen(false);
                }}
              >
                {user ? (
                  <img
                    src={user.picture || userpic}
                    className="rounded-full w-10 h-10 object-cover"
                  />
                ) : (
                  <FaUser className="text-[24px]" />
                )}
              </div>
              {user && (
                <div
                  className="md:flex hidden ml-5  transition-all duration-150 relative "
                  ref={notiRef}
                >
                  <BsLightbulbFill
                    className={`cursor-pointer hover:text-yellow-500 transition-all duration-150  
                      ${showNoti ? "text-yellow-500" : ""}`}
                    onClick={async () => {
                      if (user) {
                        setShowNoti((prev) => !prev);
                        await markAllRead();
                        await getNotification();
                      } else {
                        alert("Login to check notifications");
                      }
                    }}
                  />
                  <div className="absolute text-red-600 pointer-events-none text-[18px] right-2 bottom-0.5 font-bold">
                    {notiCount > 0 ? notiCount : ""}
                  </div>
                  <NotificationList
                    notiData={notiData}
                    showNoti={showNoti}
                    setShowNoti={setShowNoti}
                    loadingNoti={loadingNoti}
                    getNotification={getNotification}
                  />
                </div>
              )}
              {user && (
                <div
                  className="relative cursor-pointer group"
                  onClick={() => navigate("/chat")}
                >
                  <BsChatDotsFill
                    className={`ml-4 transition-all duration-150  group-hover:text-red-400
                     ${location.startsWith("/chat") ? "text-red-400" : ""}`}
                  />
                  {unread && !location.startsWith("/chat") && (
                    <GoDotFill className="absolute -right-3 text-[25px] text-red-500 -top-1" />
                  )}
                </div>
              )}
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Header;
