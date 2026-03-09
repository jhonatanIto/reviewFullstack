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

export const getCards = async (token: string | null) => {
  try {
    const res = await fetch("http://localhost:3000/api/cards", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(data?.message);
      return;
    }

    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getWatchCards = async (token: string | null) => {
  try {
    const res = await fetch("http://localhost:3000/api/watchlist", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(data?.message);
      return;
    }

    return data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteWatchCard = async (
  token: string | null,
  id: number | null,
) => {
  try {
    const res = await fetch(`http://localhost:3000/api/watchlist/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(data?.message);
      return;
    }

    return data;
  } catch (error) {
    console.error(error);
  }
};

export const fetchProfile = async (unique: string, token: string) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/users/profile/${unique}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res.json();
  } catch (error) {
    console.error(error);
  }
};

export const toggleFollow = async (unique: string, token: string) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/users/${unique}/follow`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await res.json();

    if (!res.ok) {
      console.log(data?.message);
      return;
    }
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getFollowing = async (token: string) => {
  try {
    const res = await fetch(`http://localhost:3000/api/users/following`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      console.log(data?.message);
      return;
    }
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};
