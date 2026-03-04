import { useEffect, useState, type ReactNode } from "react";
import { UserContext, type User } from "./UserContext";

interface Props {
  children: ReactNode;
}

const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

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

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedToken) setToken(savedToken);
  }, []);

  return (
    <UserContext.Provider value={{ user, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
