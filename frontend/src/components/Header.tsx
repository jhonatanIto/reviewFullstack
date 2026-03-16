import { IoSearchOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { fetchMovies, searchMovies } from "../utils/fetchData";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/useUser";
import { useMovie } from "../context/useMovie";
import type { Movie } from "../context/MovieContext";
import userpic from "../images/user.png";

type GalleryOption = "Watch list" | "Reviews";

const routes = {
  "Watch list": "watchlist",
  Reviews: "reviews",
};

const Header = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const location = useLocation().pathname;
  const navigate = useNavigate();

  const [galleryList, setGalleryList] = useState<boolean>(false);
  const [selectedGallery, setSelectedGallery] =
    useState<GalleryOption>("Reviews");
  const galleryRef = useRef<HTMLLIElement>(null);

  const {
    user,
    setShowWatch,
    search,
    setSearch,
    typeRef,
    setDisplayInput,
    displayInput,
    searchUserRes,
  } = useUser();
  const { setMovies } = useMovie();

  useEffect(() => {
    const closeInput = (e: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current?.contains(e.target as Node) &&
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
      navigate("/");
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

  return (
    <div
      className="flex flex-col md:flex-row w-full justify-between items-center text-white text-[18px] md:text-[26px] 
    px-4 md:px-10 pt-6 md:pt-10"
    >
      <div
        className="hidden  md:ml-[7%] w-auto justify-between items-center md:flex text-purple-500 cursor-pointer select-none mb-3 md:mb-0 "
        onClick={() => navigate("/")}
      >
        <span className="bg-purple-500 rounded-[5px] px-2 py-0.5 flex items-center justify-center text-white mr-2">
          MY
        </span>{" "}
        REVIEW
      </div>

      <div className="flex justify-center md:justify-end md:mr-[7%] w-full md:w-auto ">
        <ul className="flex flex-wrap justify-center items-center gap-4 md:gap-0">
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
              onClick={() => (user ? navigate("/friends") : navigate("/login"))}
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
              className="bg-white text-black text-[18px] py-1 outline-none pl-2 transition-all ease-in-out duration-400 rounded-sm "
              placeholder="Search..."
            />

            <div className="flex items-center ml-2">
              {!displayInput && <div className="mr-4 opacity-50">|</div>}
              <IoSearchOutline
                onClick={() => {
                  setDisplayInput(true);
                  inputRef.current?.focus();
                }}
                className="text-[28px] cursor-pointer hover:text-purple-500 transition-all duration-200"
              />
              <div
                className={`ml-4 cursor-pointer hover:text-purple-500 transition-all duration-200
                   ${location === "/login" || location === "/profile" ? "text-purple-500" : ""}`}
                onClick={() => navigate(user ? "/profile" : "/login")}
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
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Header;
