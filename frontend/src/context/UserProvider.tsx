import { useEffect, useRef, useState, type ReactNode } from "react";
import { UserContext, type Cards, type User } from "./UserContext";
import { getCards, getWatchCards } from "../utils/fetchData";
import { backend } from "../utils/fetchData";
import type { Notification } from "../components/Header";
import { socket } from "../utils/socket";

interface Props {
  children: ReactNode;
}

const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cards, setCards] = useState<Cards[]>([]);
  const [watchlist, setWatchlist] = useState<Cards[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showWatch, setShowWatch] = useState<boolean>(false);
  const [displayInput, setDisplayInput] = useState<boolean>(false);
  const typeRef = useRef<HTMLDivElement>(null);
  const searchUserRes = useRef<HTMLDivElement>(null);
  const [unread, setUnread] = useState<boolean>(false);

  const [notiData, setNotiData] = useState<Notification[]>([]);

  const login = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("MyReview_user", JSON.stringify(user));
    localStorage.setItem("MyReview_token", token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setCards([]);
    setNotiData([]);
    localStorage.removeItem("MyReview_user");
    localStorage.removeItem("MyReview_token");
    localStorage.removeItem("MyReview_cards");
  };

  const isTokenValid = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${backend}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.log("response", data);
        logout();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("MyReview_user");
    const savedToken = localStorage.getItem("MyReview_token");
    const savedCards = localStorage.getItem("MyReview_cards");
    const savedWatchlist = localStorage.getItem("MyReview_watchlist");

    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedCards) setCards(JSON.parse(savedCards));
    if (savedWatchlist) setWatchlist(JSON.parse(savedWatchlist));
  }, []);

  const loadCards = async () => {
    if (!token) return;

    const data = await getCards(token);
    if (data) {
      setCards(data || []);
      localStorage.setItem("MyReview_cards", JSON.stringify(data));
    }

    const watchData = await getWatchCards(token);
    if (watchData) {
      localStorage.setItem("MyReview_watchlist", JSON.stringify(watchData));
      setWatchlist(watchData);
    }
  };

  useEffect(() => {
    loadCards();
    isTokenValid();
  }, [token]);

  useEffect(() => {
    if (!user?.id) return;

    const registerUser = () => {
      socket.emit("register", user.id);
    };

    if (socket.connected) {
      registerUser();
    }

    socket.on("connect", registerUser);

    return () => {
      socket.off("connect", registerUser);
    };
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        cards,
        watchlist,
        setCards,
        loadCards,
        loading,
        setLoading,
        showWatch,
        setShowWatch,
        setSearch,
        search,
        typeRef,
        displayInput,
        setDisplayInput,
        searchUserRes,
        setNotiData,
        notiData,
        unread,
        setUnread,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
