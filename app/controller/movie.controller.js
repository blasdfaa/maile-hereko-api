import authorModel from '../model/author.model.js';
import {
  getOneMovieById,
  getOneTVShowById,
  getWatchedMovies,
  pickMoviesPageFields,
  pickShortMoviesData,
  pickTVShowPageFields,
  searchByQuery,
} from '../service/movie.service.js';
import { findAuthor } from '../service/user.service.js';
import { HTTP_STATUS, MOVIE_TYPE } from '../utils/constants.js';

export const getWatched = async (req, res) => {
  try {
    const author = await findAuthor();
    if (!author) {
      return res.status(HTTP_STATUS.notFound).json({ ok: false, message: 'User not found' });
    }

    const { page, s, media_type, limit } = req.query;

    const movies = await getWatchedMovies({ mediaType: media_type, query: s, page, limit });
    const results = { ...movies, results: pickShortMoviesData(movies.results) };

    return res.status(HTTP_STATUS.ok).json({ ok: true, ...results });
  } catch (error) {
    return res
      .status(HTTP_STATUS.serverError)
      .json({ ok: false, message: 'Failed to get movies. Try again' });
  }
};

export const getById = (type) => async (req, res) => {
  try {
    const author = await findAuthor();
    if (!author) {
      return res.status(HTTP_STATUS.notFound).json({ ok: false, message: 'User not found' });
    }

    const movieId = req.params.id;

    const movie = type === 'movie' ? await getOneMovieById(movieId) : await getOneTVShowById(movieId);
    if (!movie) {
      return res.status(HTTP_STATUS.notFound).json({ ok: false, message: 'Movie not found' });
    }

    const results = type === 'movie' ? pickMoviesPageFields(movie) : pickTVShowPageFields(movie);
    return res.status(HTTP_STATUS.ok).json({ ok: true, ...results });
  } catch (error) {
    return res
      .status(HTTP_STATUS.serverError)
      .json({ ok: false, message: 'Failed to get movies. Try again' });
  }
};

export const getBySearch = async (req, res) => {
  try {
    // example.com/api/search?s=someValue
    const query = req.query.s;
    const page = req.query.page;
    const limit = req.query.limit;

    const movies = await searchByQuery(query, page, limit);
    const results = { ...movies, results: pickShortMoviesData(movies.results) };

    return res.status(HTTP_STATUS.ok).json({ ok: true, ...results });
  } catch (error) {
    console.error('error: ', error);
    return res.status(HTTP_STATUS.serverError).json({ ok: false, message: 'Server error' });
  }
};

export const markAsWatched = async (req, res) => {
  const { id, media_type } = req.body;

  const updatedWatchedKey = media_type === MOVIE_TYPE.tv ? 'tv_shows_ids' : 'movies_ids';
  const updatedSuggestedKey = media_type === MOVIE_TYPE.tv ? 'suggested_tv_ids' : 'suggested_movies_ids';

  const author = await authorModel.findOne({});

  // Вернуть ошибку если фильм с таким айди уже находится в просмотренных
  if (author[updatedWatchedKey].includes(id)) {
    return res.status(HTTP_STATUS.badRequest).json({ ok: false, message: 'Movie has already been watched' });
  }

  await author.updateOne({ $pull: { [updatedSuggestedKey]: id } }).exec();
  await author.updateOne({ $push: { [updatedWatchedKey]: id } }).exec();

  try {
    return res.status(HTTP_STATUS.ok).json({ ok: true });
  } catch (error) {
    console.error('error: ', error);
    return res.status(HTTP_STATUS.serverError).json({ ok: false, message: 'Server error' });
  }
};
