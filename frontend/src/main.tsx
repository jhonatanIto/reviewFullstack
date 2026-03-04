import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./utils/router.tsx";
import UserProvider from "./context/UserProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <UserProvider>
    <RouterProvider router={router} />,
  </UserProvider>,
);
