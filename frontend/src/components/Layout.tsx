import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Login from "./Login";
import Modal from "./Modal";
import Loading from "./Loading";
import { ToastContainer } from "react-toastify";

const Layout = () => {
  const [startIndex, setStartIndex] = useState(0);
  const location = useLocation();

  return (
    <div className="w-full min-h-screen relative flex flex-col bg-zinc-900 z-0">
      <Header setStartIndex={setStartIndex} />

      <Outlet
        context={{
          startIndex,

          setStartIndex,
        }}
      />
      <Modal />
      {location.pathname === "/login" && <Login />}
      <Loading />
      <ToastContainer />
    </div>
  );
};

export default Layout;
