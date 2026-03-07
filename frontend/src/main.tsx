import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./utils/router.tsx";
import UserProvider from "./context/UserProvider.tsx";
import MovieProvider from "./context/MovieProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <MovieProvider>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </MovieProvider>,
);
