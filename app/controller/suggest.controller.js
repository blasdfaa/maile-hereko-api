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
      res.status(HTTP_STATUS.badRequest).json({ ok: false, message: 'Film has already been suggested' });
      return;
    }

    await author
      .updateOne(
        {
          $push: {
            [updatedKey]: id,
          },
        },
        { new: true, upsert: true },
      )
      .exec();

    res.status(HTTP_STATUS.ok).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(HTTP_STATUS.serverError).json({ ok: false, message: 'Server error' });
  }
};

export const getSuggestedMovies = async (req, res) => {
  try {
    const movieType = req.query.movie_type;
    const searchQuery = req.query.s;
    const page = req.query.page;
    const limit = req.query.limit;

    const result = await findSuggestedMovies({ type: movieType, query: searchQuery, limit, page });

    res.status(HTTP_STATUS.ok).json({ ok: true, ...result });
  } catch (e) {
    console.error(e);
    res.status(HTTP_STATUS.serverError).json({ ok: false, message: 'Server error' });
  }
};
