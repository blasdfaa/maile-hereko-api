import {
  getMoviesByIds,
  getOneMovieById,
  getOneTVShowById,
  getTVShowsByIds,
  pickMoviesPageFields,
  pickShortMoviesData,
  pickTVShowPageFields,
  searchByQuery,
} from '../service/movie.service.js';
import { findAuthor } from '../service/user.service.js';
import { HTTP_STATUS } from '../utils/constants.js';
import { filterBy } from '../utils/filterBy.js';
import { searchBy } from '../utils/searchBy.js';

export const getWatched = async (req, res) => {
  try {
    const author = await findAuthor();
    if (!author) {
      return res.status(HTTP_STATUS.notFound).json({ ok: false, message: 'User not found' });
    }

    const watchedMovies = await getMoviesByIds(author.movies_ids);
    const watchedTVShows = await getTVShowsByIds(author.tv_shows_ids);

    let searchResult = [...watchedMovies, ...watchedTVShows];

    const hasQueryParams = Object.keys(req.query).length > 0;
    const searchQuery = await req.query;

    if (hasQueryParams) {
      const searchString = searchQuery.s?.toLowerCase() ?? '';
      const searchMediaType = searchQuery.media_type?.toLowerCase() ?? '';

      searchResult = searchResult
        .filter(searchBy('original_title', searchString))
        .filter(filterBy('media_type', searchMediaType));
    }

    return res.status(HTTP_STATUS.ok).json({ ok: true, results: pickShortMoviesData(searchResult) });
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
