interface BackgroundProps {
  movieImage: string;
}

const BackgroundImg = ({ movieImage }: BackgroundProps) => {
  return (
    <div className="fixed inset-0 flex -z-10">
      <img
        className="absolute top-0 left-[-20%] w-[60vw] h-[120%] object-cover object-right"
        src={movieImage}
      />
      <img
        className="absolute top-0 left-[40%] w-[60vw] h-[120%] object-cover object-left -scale-x-100"
        src={movieImage}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/0"></div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent"></div>
    </div>
  );
};

export default BackgroundImg;
