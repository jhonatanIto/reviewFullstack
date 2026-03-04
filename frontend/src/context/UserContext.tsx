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
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);
