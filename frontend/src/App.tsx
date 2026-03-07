import { useOutletContext } from "react-router-dom";
import BackgroundImg from "./components/BackgroundImg";
import Carousel from "./components/Carousel";
import Middle from "./components/Middle";
import type { Dispatch } from "react";

type LayoutContext = {
  startIndex: number;
  setStartIndex: Dispatch<React.SetStateAction<number>>;
};

const App = () => {
  const {
    startIndex,

    setStartIndex,
  } = useOutletContext<LayoutContext>();

  return (
    <>
      <BackgroundImg />
      <Middle />
      <Carousel setStartIndex={setStartIndex} startIndex={startIndex} />
    </>
  );
};

export default App;
