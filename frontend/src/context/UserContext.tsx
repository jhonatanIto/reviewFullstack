import { createContext } from "react";

export interface User {
  id: number;
  name: string;
  email: string;
  picture: string | null;
}

interface UserContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  cards: Cards[];
  setCards: React.Dispatch<React.SetStateAction<Cards[]>>;
  loadCards: () => void;
}

export interface Cards {
  id: number;
  title: string;
  release: string;
  description: string;
  poster: string;
  review: string;
  rate: number;
  created_at: string;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);
