export const fetchMovies = async (movieName: string) => {
  try {
    const apiKey = import.meta.env.VITE_OMDB_API_KEY;
    const res = await fetch(
      `https://www.omdbapi.com/?s=${movieName}&plot=full&page=1&apikey=${apiKey}`,
    );

    const data = await res.json();

    if (data.Response === "True") return data;
  } catch (err) {
    console.error(err);
  }
};
