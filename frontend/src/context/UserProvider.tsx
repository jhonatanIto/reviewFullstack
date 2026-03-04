import { useState, type ReactNode } from "react";
import { UserContext } from "./UserContext";

interface Props {
  children: ReactNode;
}
interface User {
  id: number;
  name: string;
  email: string;
}

const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState();
  const [token, setToken] = useState();

  return (
    <UserContext.Provider value={{ user, token }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
