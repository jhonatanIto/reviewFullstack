import { IoStar } from "react-icons/io5";

interface StarsProps {
  rate: number;
  setRate: React.Dispatch<React.SetStateAction<number>>;
  top: number;
  size: number;
}

const Stars = ({ rate, setRate, top, size }: StarsProps) => {
  return (
    <div style={{ top: `${top}px` }} className={`flex  absolute gap-2 `}>
      {[...Array(5)].map((star, index) => {
        const currentRate = index + 1;
        return (
          <div key={currentRate}>
            <label>
              <input
                className="hidden"
                type="radio"
                value={currentRate}
                onClick={() => {
                  setRate(currentRate);
                }}
              />
              <IoStar
                style={{ fontSize: `${size}px` }}
                color={rate <= index ? "white" : "oklch(82.8% 0.189 84.429)"}
                className=" text-amber-400 cursor-pointer"
              />
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default Stars;
