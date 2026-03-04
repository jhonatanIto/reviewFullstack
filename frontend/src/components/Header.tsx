import { IoSearchOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { useEffect, useRef, useState, type Dispatch } from "react";
import { fetchMovies, searchMovies } from "../utils/fetchData";
import type { Movie } from "./Layout";
import { useLocation, useNavigate } from "react-router-dom";

interface HeaderProps {
  setMovies: Dispatch<React.SetStateAction<Movie[]>>;
}

const Header = ({ setMovies }: HeaderProps) => {
  const [displayInput, setDisplayInput] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const closeInput = (e: MouseEvent) => {
      if (inputRef && !inputRef.current?.contains(e.target as Node)) {
        setDisplayInput(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", closeInput);

    return () => document.removeEventListener("mousedown", closeInput);
  }, []);

  useEffect(() => {
    const inputValue = search.trim();
    if (inputValue.length <= 1) return;

    const timeout = setTimeout(async () => {
      const data = await searchMovies(inputValue);
      const allMovies = data.slice(0, 10);

      const convMovies = allMovies.map((c: Movie) => {
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
      const allMovies = data.slice(0, 10);

      const convMovies = allMovies.map((c: Movie) => {
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

  return (
    <div className="flex w-full justify-between text-white text-[26px] p-10 pl-0">
      <div className="ml-[7%] w-37 justify-between items-center flex text-purple-500">
        <span className="bg-purple-500 rounded-[5px] w-12 flex items-center justify-center text-white">
          MY
        </span>{" "}
        REVIEW
      </div>
      <div className=" flex justify-end mr-[7%]">
        <ul
          className="flex items-center   [&>li]:select-none [&>li]:cursor-pointer [&>li]:pb-2 [&>li]:mr-15
        [&>li]:hover:text-purple-500 [&>li]:transition-all [&>li]:duration-200"
        >
          <li
            className={`relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0
               after:bg-purple-500 after:transition-all after:duration-300
              ${location.pathname === "/" ? "after:w-full" : ""}`}
            onClick={() => navigate("/")}
          >
            Home
          </li>
          <li
            className={`relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0
               after:bg-purple-500 after:transition-all after:duration-300
              ${location.pathname === "/gallery" ? "after:w-full" : ""}`}
            onClick={() => navigate("/gallery")}
          >
            Gallery
          </li>
          <li
            className={`relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0
               after:bg-purple-500 after:transition-all after:duration-300
              ${location.pathname === "/friends" ? "after:w-full" : ""}`}
            onClick={() => navigate("/friends")}
          >
            Friends
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
            placeholder="search"
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
                 ${location.pathname === "/login" ? "text-purple-500" : ""}`}
              onClick={() => navigate("/login")}
            />
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Header;
