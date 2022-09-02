import authorModel from '../model/author.model.js';
import { movieModel } from '../model/movie.model.js';

export const findSuggestedMovies = async ({ query, page = 1, limit = 10 }) => {
  const author = await authorModel.findOne({}).lean();

  const suggestedMoviesIds = [...author.suggested_movies_ids, ...author.suggested_tv_ids];
  const watchedMoviesIds = [...author.movies_ids, ...author.tv_shows_ids];

  const aggregate = movieModel.aggregate([
    { $unionWith: { coll: 'series' } },
    // Получить указанные поля
    { $project: { _id: 1, title: 1, poster_path: 1, vote_average: 1, media_type: 1, adult: 1 } },
    // Получить документы которые посоветовали.
    { $match: { _id: { $in: suggestedMoviesIds } } },
    // Если не указан параметр для поиска, вернутся все фильмы которые имеют заголовок
    { $match: { title: query ? { $regex: query, $options: 'i' } : { $exists: true } } },
    // Добавить поле "is_watched" просмотренным фильмам
    { $addFields: { is_watched: { $cond: [{ $in: ['$_id', watchedMoviesIds] }, true, false] } } },
    { $sort: { title: 1, _id: 1 } },
  ]);

  return movieModel.aggregatePaginate(aggregate, { page, limit });
};
