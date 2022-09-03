import { pickShortMoviesData } from '../service/movie.service.js';
import { findSuggestedMovies } from '../service/suggest.service.js';
import { findAuthor } from '../service/user.service.js';
import { HTTP_STATUS, MOVIE_TYPE } from '../utils/constants.js';

export const doSuggest = async (req, res) => {
  try {
    const { id, media_type } = req.body;

    const updatedKey = media_type === MOVIE_TYPE.tv ? 'suggested_tv_ids' : 'suggested_movies_ids';

    const author = await findAuthor();

    // Вернуть ошибку если фильм с таким айди уже был предложен
    if (author[updatedKey].includes(id)) {
      return res
        .status(HTTP_STATUS.badRequest)
        .json({ ok: false, message: 'Film has already been suggested' });
    }

    await author.updateOne({ $push: { [updatedKey]: id } }, { new: true, upsert: true }).exec();

    return res.status(HTTP_STATUS.ok).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(HTTP_STATUS.serverError).json({ ok: false, message: 'Server error' });
  }
};

export const getSuggestedMovies = async (req, res) => {
  try {
    const searchQuery = req.query.s;
    const page = req.query.page;
    const limit = req.query.limit;

    const movies = await findSuggestedMovies({ query: searchQuery, limit, page });
    const results = { ...movies, results: pickShortMoviesData(movies.results) };

    return res.status(HTTP_STATUS.ok).json({ ok: true, ...results });
  } catch (e) {
    console.error(e);
    return res.status(HTTP_STATUS.serverError).json({ ok: false, message: 'Server error' });
  }
};
