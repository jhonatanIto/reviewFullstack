import { useUser } from "../context/useUser";
import useRate from "../hooks/useRate";
import Stars from "./Stars";

const Gallery = () => {
  const { cards } = useUser();
  const { setRate } = useRate();
  return (
    <div className=" w-full p-10">
      <div className="flex">
        {cards?.map((c) => {
          return (
            <div
              key={c.id}
              className="w-60  ml-2 mr-2 overflow-hidden relative  group cursor-pointer "
            >
              <div
                className="opacity-0 w-full group-hover:opacity-100 transition-opacity
               duration-200 absolute inset-0 bg-black/70 z-10 flex justify-center "
              >
                <Stars rate={c.rate} top={15} setRate={setRate} size={25} />
                <div className="text-white text-[20px] mt-[18%] text-center">
                  {c.review}
                </div>
              </div>

              <img
                className="group-hover:scale-110 transition-transform duration-200 "
                src={c.poster}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Gallery;
