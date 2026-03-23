import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import App from "../App";
import Gallery from "../components/Gallery";
import Friends from "../components/Friends";
import Login from "../components/Login";
import Profile from "../components/Profile";
import CardPage from "../components/CardPage";
import VisitorPov from "../components/VisitorPov";
import ChatPage from "../components/ChatPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        element: <App />,
        children: [
          { index: true, element: null },
          {
            path: ":unique/:id",
            element: <CardPage />,
          },
        ],
      },

      {
        path: "reviews",
        element: <Gallery />,
        children: [{ path: ":id", element: <CardPage /> }],
      },
      {
        path: "watchlist",
        element: <Gallery />,
      },
      {
        path: "friends",
        element: <Friends />,
        children: [{ path: ":id", element: <CardPage /> }],
      },
      { path: "profile", element: <Profile /> },
      {
        path: "profile/:unique",
        element: <VisitorPov />,
        children: [{ path: ":id", element: <CardPage /> }],
      },
      {
        path: "chat",
        element: <ChatPage />,
      },
      {
        path: "chat/:unique",
        element: <ChatPage />,
      },

      {
        path: "login",
        element: <App />,
        children: [{ path: "", element: <Login /> }],
      },
    ],
  },
]);
