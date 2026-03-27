import { createContext, type RefObject } from "react";
import type { Notification } from "../components/Header";

export interface User {
  id: number;
  name: string;
  email: string;
  picture: string | null;
  unique_id: string;
  followers: string;
  following: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  cards: Cards[];
  watchlist: Cards[];
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setCards: React.Dispatch<React.SetStateAction<Cards[]>>;
  loadCards: () => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  showWatch: boolean;
  setShowWatch: React.Dispatch<React.SetStateAction<boolean>>;
  typeRef: RefObject<HTMLDivElement | null>;
  searchUserRes: RefObject<HTMLDivElement | null>;
  displayInput: boolean;
  setDisplayInput: React.Dispatch<React.SetStateAction<boolean>>;
  notiData: Notification[];
  setNotiData: React.Dispatch<React.SetStateAction<Notification[]>>;
  unread: boolean;
  setUnread: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface Cards {
  banner: string;
  created_at: string;
  description: string | null;
  id: number;
  poster: string;
  rate: number;
  release: string;
  review: string;
  title: string;
  tmdb_id: number;
  user_name: string;
  user_picture: string;
  user_unique_id: string;
  comments_count: number;
  likes_count: number;
  liked_by_user: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);
