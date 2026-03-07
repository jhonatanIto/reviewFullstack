import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import App from "../App";
import Gallery from "../components/Gallery";
import Friends from "../components/Friends";
import Login from "../components/Login";
import Profile from "../components/Profile";
import CardPage from "../components/CardPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      {
        path: "gallery",
        element: <Gallery />,
        children: [{ path: ":id", element: <CardPage /> }],
      },
      {
        path: "watchlist",
        element: <Gallery />,
      },
      { path: "friends", element: <Friends /> },
      { path: "profile", element: <Profile /> },
      {
        path: "login",
        element: <App />,
        children: [{ path: "", element: <Login /> }],
      },
    ],
  },
]);
