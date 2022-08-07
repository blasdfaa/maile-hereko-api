import axios from 'axios';

import { genres } from '../utils/genres.js';

const MOVIE_DB_KEY = process.env.MOVIE_DB_KEY;

const getGenresNames = (genres = []) => {
  return genres.map((genre) => genre.name);
};

export const getGenresByIds = (ids) => {
  return ids.map((id) => genres.find((genre) => genre.id === id).name);
};

export const getMediaByIds = async (ids, type = 'movie') => {
  const getById = async (id) => {
    const { data } = await axios.get(`https://api.themoviedb.org/3/${type}/${id}`, {
      params: { api_key: MOVIE_DB_KEY },
    });

    return data;
  };

  return await Promise.all(ids.map((id) => getById(id)));
};

export const pickShortMoviesData = (movies = []) => {
  return movies.map(({ id, title, poster_path, genres, vote_average }) => ({
    id,
    title,
    poster: `https://image.tmdb.org/t/p/original${poster_path}`,
    genres: getGenresNames(genres),
    rating: vote_average,
  }));
};
