import authorModel from '../model/author.model.js';
import { movieModel } from '../model/movie.model.js';
import { MOVIE_TYPE } from '../utils/constants.js';

export const findSuggestedMovies = async ({ query, type, page = 1, limit = 10 }) => {
  const author = await authorModel.findOne({}).lean();

  const ids =
    type === MOVIE_TYPE.movie
      ? author.suggested_movies_ids
      : type === MOVIE_TYPE.tv
      ? author.suggested_tv_ids
      : [...author.suggested_movies_ids, ...author.suggested_tv_ids];

  const aggregate = movieModel.aggregate([
    { $unionWith: { coll: 'series' } },
    { $project: { _id: 0, id: 1, title: 1, poster_path: 1, vote_average: 1, media_type: 1 } },
    { $match: { id: { $in: ids } } },
    // Если не указан параметр для поиска, вернутся все фильмы которые имеют заголовок
    { $match: { title: query ? { $regex: query, $options: 'i' } : { $exists: true } } },
    { $sort: { title: 1, _id: 1 } },
  ]);
  return movieModel.aggregatePaginate(aggregate, { page, limit });
};
