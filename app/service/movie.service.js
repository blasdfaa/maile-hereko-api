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

export const searchByQuery = async (query, page = 1, limit = 10) => {
  const aggregate = movieModel.aggregate([
    { $unionWith: { coll: 'series' } },
    { $project: { _id: 0, id: 1, title: 1, poster_path: 1, vote_average: 1, media_type: 1 } },
    // Если не указан параметр для поиска, вернутся все фильмы которые имеют заголовок
    { $match: { title: query ? { $regex: query, $options: 'i' } : { $exists: true } } },
    { $sort: { title: 1, _id: 1 } },
  ]);
  return movieModel.aggregatePaginate(aggregate, { page, limit });
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
  title,
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
  title,
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
