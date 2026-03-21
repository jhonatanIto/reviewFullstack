import { useEffect } from "react";
import { backend } from "../utils/fetchData";

interface NotificationProps {
  token: string;
}

const Notification = ({ token }: NotificationProps) => {
  const getNotification = async () => {
    try {
      const res = await fetch(`${backend}/api/notification`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) return console.log(data?.message);

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getNotification();
  }, [token]);
  return <div className="absolute hidden"></div>;
};

export default Notification;
