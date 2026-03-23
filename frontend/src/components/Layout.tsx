import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Login from "./Login";
import Modal from "./Modal";
import Loading from "./Loading";
import { ToastContainer } from "react-toastify";

const Layout = () => {
  const location = useLocation();

  return (
    <div className="w-full  min-h-screen relative flex flex-col bg-zinc-900 z-0 overflow-x-hidden">
      <Header />
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
      <Modal />
      {location.pathname === "/login" && <Login />}
      <Loading />
      <ToastContainer />
    </div>
  );
};

export default Layout;
