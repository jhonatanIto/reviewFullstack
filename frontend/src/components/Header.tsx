import { IoSearchOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { useEffect, useRef, useState, type Dispatch } from "react";
import { fetchMovies, searchMovies } from "../utils/fetchData";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/useUser";
import { useMovie } from "../context/useMovie";
import type { Movie } from "../context/MovieContext";

interface HeaderProps {
  setStartIndex: Dispatch<React.SetStateAction<number>>;
}
type GalleryOption = "Watch list" | "Gallery";

const routes = {
  "Watch list": "watchlist",
  Gallery: "gallery",
};

const Header = ({ setStartIndex }: HeaderProps) => {
  const [displayInput, setDisplayInput] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();

  const [galleryList, setGalleryList] = useState<boolean>(false);
  const [selectedGallery, setSelectedGallery] =
    useState<GalleryOption>("Gallery");
  const galleryRef = useRef<HTMLLIElement>(null);

  const { user, setShowWatch } = useUser();
  const { setMovies } = useMovie();

  useEffect(() => {
    const closeInput = (e: MouseEvent) => {
      if (inputRef && !inputRef.current?.contains(e.target as Node)) {
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
      setStartIndex(0);
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
    <div className="flex w-full justify-between text-white text-[26px] pr-10 pt-10 pl-0">
      <div
        className="ml-[7%] w-37 justify-between items-center flex text-purple-500 cursor-pointer select-none"
        onClick={() => navigate("/")}
      >
        <span className="bg-purple-500 rounded-[5px] w-12 flex items-center justify-center text-white">
          MY
        </span>{" "}
        REVIEW
      </div>
      <div className=" flex justify-end mr-[7%]">
        <ul
          className="flex  items-center   [&>li]:select-none [&>li]:cursor-pointer [&>li]:pb-2 [&>li]:mr-15
        [&>li]:hover:text-purple-500 [&>li]:transition-all [&>li]:duration-200 "
        >
          <li
            className={`relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0
               after:bg-purple-500 after:transition-all after:duration-300
              ${location.pathname === "/" ? "after:w-full text-purple-500" : ""}`}
            onClick={() => navigate("/")}
          >
            <div>Home</div>
          </li>
          <li
            ref={galleryRef}
            className={`relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 
               after:bg-purple-500 after:transition-all after:duration-300  flex justify-center  
              ${location.pathname === "/gallery" || location.pathname === "/watchlist" ? "after:w-full text-purple-500" : ""}`}
            onClick={() => {
              setGalleryList(false);
              navigate(`/${routes[selectedGallery]}`);
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
              className={`absolute top-15  border-purple-500   w-30 flex flex-col items-center text-white
              [&>div]:w-full text-center [&>div]:p-1 [&>div]:border-purple-500 [&>div]:text-[20px] 
              ${galleryList ? " translate-y-0 pointer-events-auto" : "-translate-y-10  opacity-0 pointer-events-none"}
               transition-all duration-200 ease-in-out [&>div]:hover:bg-purple-500/30 `}
            >
              {selectedGallery !== "Gallery" && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGalleryChange("Gallery");
                  }}
                >
                  Gallery
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
            className={`relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0
               after:bg-purple-500 after:transition-all after:duration-300 
              ${location.pathname === "/friends" ? "after:w-full text-purple-500" : ""}`}
            onClick={() => navigate("/friends")}
          >
            <div>Friends</div>
          </li>
          <input
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            ref={inputRef}
            style={{
              opacity: displayInput ? 1 : 0,
              pointerEvents: displayInput ? "auto" : "none",
              maxWidth: displayInput ? "320px" : "0px",
              minWidth: displayInput ? "320px" : "0px",
            }}
            type="text"
            className="bg-white text-black text-[23px] outline-none pl-2 
            transition-all ease-in-out duration-400 "
            placeholder="Search"
          />
          <div className="flex justify-center items-center select-none">
            <div style={{ display: displayInput ? "none" : "flex" }}>|</div>
            <IoSearchOutline
              onClick={() => {
                setDisplayInput(true);
                inputRef.current?.focus();
              }}
              className="text-[30px] ml-5 cursor-pointer hover:text-purple-500 transition-all duration-200"
            />
            <FaUser
              className={`ml-5 cursor-pointer hover:text-purple-500 transition-all duration-200
                 ${location.pathname === "/login" || location.pathname === "/profile" ? "text-purple-500" : ""}`}
              onClick={() => {
                if (!user) {
                  navigate("/login");
                } else {
                  navigate("/profile");
                }
              }}
            />
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Header;
