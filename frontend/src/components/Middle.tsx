interface MiddleProps {
  movieName: string;
  movieDescription: string;
  movieRelease: string;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Middle = ({
  movieName,
  movieDescription,
  movieRelease,
  setModal,
}: MiddleProps) => {
  return (
    <div className="text-white ml-[7%] mt-10">
      <div className="text-[65px]">{movieName}</div>
      <div className="text-2xl opacity-70">{movieRelease}</div>
      <div className="mt-10 max-h-47.5   overflow-scroll  no-scrollbar text-2xl  w-200">
        {movieDescription}
      </div>
      <button
        className="mt-10 bg-purple-500 p-2 pl-6 cursor-pointer pr-6  duration-200
      text-[20px] rounded-[10px] text-black font-semibold hover:text-white hover:bg-purple-600 transition-all"
        onClick={() => setModal(true)}
      >
        Create Review
      </button>
    </div>
  );
};

export default Middle;
