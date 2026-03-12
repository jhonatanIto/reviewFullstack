import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./utils/router.tsx";
import UserProvider from "./context/UserProvider.tsx";
import MovieProvider from "./context/MovieProvider.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <MovieProvider>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </MovieProvider>
  </GoogleOAuthProvider>,
);
