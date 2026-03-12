import { Outlet, useOutletContext } from "react-router-dom";
import BackgroundImg from "./components/BackgroundImg";
import Carousel from "./components/Carousel";
import Middle from "./components/Middle";
import { useEffect, useState, type Dispatch } from "react";
import type { Cards } from "./context/UserContext";
import { homePageCards } from "./utils/fetchData";

type LayoutContext = {
  startIndex: number;
  setStartIndex: Dispatch<React.SetStateAction<number>>;
};

const App = () => {
  const {
    startIndex,

    setStartIndex,
  } = useOutletContext<LayoutContext>();
  const [feedCards, setFeedCards] = useState<Cards[]>([]);
  const tab = "home";

  useEffect(() => {
    const getFeed = async () => {
      const data = await homePageCards();
      setFeedCards(data);
    };
    getFeed();
  }, []);

  return (
    <>
      <BackgroundImg />
      <Middle feedCards={feedCards} />
      <Carousel setStartIndex={setStartIndex} startIndex={startIndex} />
      <Outlet context={{ cards: feedCards, tab }} />
    </>
  );
};

export default App;
