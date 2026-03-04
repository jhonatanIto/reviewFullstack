import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import App from "../App";
import Gallery from "../components/Gallery";
import Friends from "../components/Friends";
import Login from "../components/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: "gallery", element: <Gallery /> },
      { path: "friends", element: <Friends /> },
      {
        path: "login",
        element: <App />,
        children: [{ path: "", element: <Login /> }],
      },
    ],
  },
]);
