import { Outlet } from "react-router-dom";
import BackgroundImg from "./components/BackgroundImg";

import Middle from "./components/Middle";
import { useState } from "react";
import type { Cards } from "./context/UserContext";

const App = () => {
  const [feedCards, setFeedCards] = useState<Cards[]>([]);
  const tab = "home";

  return (
    <div>
      <BackgroundImg />
      <Middle feedCards={feedCards} setFeedCards={setFeedCards} />
      <Outlet context={{ cards: feedCards, tab }} />
    </div>
  );
};

export default App;
