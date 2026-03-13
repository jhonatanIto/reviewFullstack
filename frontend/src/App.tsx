import { Outlet } from "react-router-dom";
import BackgroundImg from "./components/BackgroundImg";
import Carousel from "./components/Carousel";
import Middle from "./components/Middle";
import { useEffect, useState } from "react";
import type { Cards } from "./context/UserContext";
import { homePageCards } from "./utils/fetchData";

const App = () => {
  const [feedCards, setFeedCards] = useState<Cards[]>([]);
  const tab = "home";

  useEffect(() => {
    const getFeed = async () => {
      const data = await homePageCards();
      setFeedCards(data || []);
    };
    getFeed();
  }, []);

  return (
    <>
      <BackgroundImg />
      <Middle feedCards={feedCards} />
      <Carousel />
      <Outlet context={{ cards: feedCards, tab }} />
    </>
  );
};

export default App;
