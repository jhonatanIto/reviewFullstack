import { useState } from "react";

const useRate = () => {
  const [rate, setRate] = useState<number>(1);
  const [review, setReview] = useState<string>("");

  return { rate, setRate, review, setReview };
};

export default useRate;
