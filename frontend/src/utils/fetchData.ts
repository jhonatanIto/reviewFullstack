const tmdbKey = import.meta.env.VITE_TMDB_API_KEY;

export const fetchMovies = async () => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${tmdbKey}`,
    );

    const data = await res.json();

    return data.results;
  } catch (err) {
    console.error(err);
  }
};

export const searchMovies = async (name: string) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&query=${name}`,
    );
    const data = await res.json();

    return data.results;
  } catch (error) {
    console.error(error);
  }
};
