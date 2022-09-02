import authorModel from '../model/author.model.js';
import { movieModel, tvShowModel } from '../model/movie.model.js';

export const getOneMovieById = async (id) => {
  return movieModel.findById(id).lean();
};

export const getOneTVShowById = async (id) => {
  return tvShowModel.findById(id).lean();
};

export const getMoviesByIds = async (ids) => {
  return movieModel.find({ _id: { $in: ids } }).exec();
};

export const getTVShowsByIds = async (ids) => {
  return tvShowModel.find({ _id: { $in: ids } }).exec();
};

export const searchByQuery = async (query, page = 1, limit = 10) => {
  const author = await authorModel.findOne({}).lean();

  const suggestedMoviesIds = [...author.suggested_movies_ids, ...author.suggested_tv_ids];
  const watchedMoviesIds = [...author.movies_ids, ...author.tv_shows_ids];

  const aggregate = movieModel.aggregate([
    { $unionWith: { coll: 'series' } },
    // Получить указанные поля
    { $project: { _id: 1, title: 1, poster_path: 1, vote_average: 1, media_type: 1, adult: 1 } },
    // Получить документы которые ещё не посоветовали.
    { $match: { _id: { $nin: suggestedMoviesIds } } },
    // Если не указан параметр для поиска, вернутся все фильмы которые имеют заголовок
    { $match: { title: query ? { $regex: query, $options: 'i' } : { $exists: true } } },
    // Добавить поле "is_watched" просмотренным фильмам
    { $addFields: { is_watched: { $cond: [{ $in: ['$_id', watchedMoviesIds] }, true, false] } } },
    { $sort: { title: 1, _id: 1 } },
  ]);

  return movieModel.aggregatePaginate(aggregate, { page, limit });
};

export const pickShortMoviesData = (movies = []) => {
  return movies.map(({ _id, title, poster_path, vote_average, media_type, adult, ...other }) => ({
    id: _id,
    title,
    poster: poster_path ? `https://image.tmdb.org/t/p/original${poster_path}` : null,
    rating: vote_average,
    media_type,
    adult,
    ...other,
  }));
};

export const pickMoviesPageFields = ({
  _id,
  title,
  poster_path,
  backdrop_path,
  genres,
  vote_average,
  overview,
  media_type,
  release_date,
  runtime,
  adult,
}) => ({
  id: _id,
  title,
  backdrop_path: backdrop_path ? `https://image.tmdb.org/t/p/original${backdrop_path}` : null,
  poster: poster_path ? `https://image.tmdb.org/t/p/original${poster_path}` : null,
  rating: vote_average,
  genres,
  description: overview,
  media_type,
  release_date,
  runtime,
  adult,
});

export const pickTVShowPageFields = ({
  _id,
  title,
  poster_path,
  backdrop_path,
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
  adult,
}) => ({
  id: _id,
  title,
  backdrop_path: backdrop_path ? `https://image.tmdb.org/t/p/original${backdrop_path}` : null,
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
  adult,
});
