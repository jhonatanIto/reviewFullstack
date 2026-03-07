import { createContext } from "react";

export interface User {
  id: number;
  name: string;
  email: string;
  picture: string | null;
  unique_id: string;
}

interface UserContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  cards: Cards[];
  watchlist: Cards[];
  setCards: React.Dispatch<React.SetStateAction<Cards[]>>;
  loadCards: () => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  showWatch: boolean;
  setShowWatch: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface Cards {
  id: number;
  title: string;
  release: string;
  description: string;
  poster: string;
  review?: string;
  rate?: number;
  banner?: string;
  created_at: string;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);
