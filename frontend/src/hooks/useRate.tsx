import { useState } from "react";

const useRate = () => {
  const [rate, setRate] = useState<number>(1);

  return { rate, setRate };
};

export default useRate;
