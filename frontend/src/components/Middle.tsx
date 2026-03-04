interface MiddleProps {
  movieName: string;
  movieDescription: string;
  movieRelease: string;
}

const Middle = ({ movieName, movieDescription, movieRelease }: MiddleProps) => {
  return (
    <div className="text-white ml-[7%]">
      <div className="text-[65px]">{movieName}</div>
      <div className="text-2xl opacity-70">{movieRelease}</div>
      <div className="mt-10 max-h-47.5   overflow-scroll  no-scrollbar text-2xl  w-200">
        {movieDescription}
      </div>
      <button
        className="mt-10 bg-purple-500 p-2 pl-6 cursor-pointer pr-6  duration-200
      text-[20px] rounded-[10px] text-black font-semibold hover:text-white hover:bg-purple-600 transition-all"
      >
        Create Review
      </button>
    </div>
  );
};

export default Middle;
