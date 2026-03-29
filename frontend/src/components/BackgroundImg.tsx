import { useMovie } from "../context/useMovie";

const BackgroundImg = () => {
  const { movieImage } = useMovie();

  return (
    <div className="fixed inset-0 flex -z-10 overflow-hidden">
      <img
        className="absolute top-0 w-full h-full object-cover object-center md:object-left -scale-x-100"
        src={movieImage}
        alt="Background"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 md:via-black/70 to-transparent"></div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 md:to-transparent"></div>
    </div>
  );
};

export default BackgroundImg;
