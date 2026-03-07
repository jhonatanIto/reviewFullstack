import { useContext } from "react";
import { MovieContext } from "./MovieContext";

export const useMovie = () => {
  const context = useContext(MovieContext);

  if (!context) throw new Error("useUser must be used inside userProvider");

  return context;
};
