import { toast, Bounce, type ToastOptions } from "react-toastify";

const useNotification = () => {
  const toastStyle: ToastOptions = {
    position: "top-center",
    autoClose: 1800,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    transition: Bounce,
  };

  const errorNotification = (message: string) =>
    toast.error(message, toastStyle);
  const successNotification = (message: string) =>
    toast.success(message, toastStyle);

  return { errorNotification, successNotification };
};

export default useNotification;
