import { movieModel, tvShowModel } from '../model/movie.model.js';

export const getOneMovieById = async (id) => {
  return movieModel.findOne({ id }).lean();
};

export const getOneTVShowById = async (id) => {
  return tvShowModel.findOne({ id }).lean();
};

export const getMoviesByIds = async (ids) => {
  return movieModel.find({ id: { $in: ids } }).exec();
};

export const getTVShowsByIds = async (ids) => {
  return tvShowModel.find({ id: { $in: ids } }).exec();
};

export const pickShortMoviesData = (movies = []) => {
  return movies.map(({ id, title, poster_path, vote_average, media_type }) => ({
    id,
    title,
    poster: poster_path ? `https://image.tmdb.org/t/p/original${poster_path}` : null,
    rating: vote_average,
    media_type,
  }));
};

export const pickMoviesPageFields = ({
  id,
  title,
  poster_path,
  genres,
  vote_average,
  overview,
  media_type,
  release_date,
  runtime,
}) => ({
  id,
  title,
  poster: poster_path ? `https://image.tmdb.org/t/p/original${poster_path}` : null,
  rating: vote_average,
  genres,
  description: overview,
  media_type,
  release_date,
  runtime,
});

export const pickTVShowPageFields = ({
  id,
  name,
  poster_path,
  vote_average,
  status,
  first_air_date,
  last_air_date,
  number_of_episodes,
  number_of_seasons,
  episode_run_time,
  genres,
  overview,
  media_type,
}) => ({
  id,
  name,
  poster: poster_path ? `https://image.tmdb.org/t/p/original${poster_path}` : null,
  rating: vote_average,
  status,
  first_air_date,
  last_air_date,
  number_of_episodes,
  number_of_seasons,
  episode_run_time,
  genres,
  description: overview,
  media_type,
});
