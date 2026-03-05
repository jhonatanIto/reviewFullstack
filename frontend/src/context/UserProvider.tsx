import { useEffect, useState, type ReactNode } from "react";
import { UserContext, type Cards, type User } from "./UserContext";
import { getCards } from "../utils/fetchData";

interface Props {
  children: ReactNode;
}

const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cards, setCards] = useState<Cards[]>([]);

  const login = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("MyReview_user", JSON.stringify(user));
    localStorage.setItem("MyReview_token", token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("MyReview_user");
    localStorage.removeItem("MyReview_token");
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("MyReview_user");
    const savedToken = localStorage.getItem("MyReview_token");
    const savedCards = localStorage.getItem("MyReview_cards");

    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedCards) setCards(JSON.parse(savedCards));
  }, []);

  const loadCards = async () => {
    if (!token) return;
    const data = await getCards(token);
    setCards(data);
    localStorage.setItem("MyReview_cards", JSON.stringify(data));
  };

  useEffect(() => {
    loadCards();
  }, [token]);

  console.log(cards);
  return (
    <UserContext.Provider
      value={{ user, token, login, logout, cards, setCards, loadCards }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
