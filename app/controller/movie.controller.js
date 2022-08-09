import {
  getMoviesByIds,
  getOneMovieById,
  getOneTVShowById,
  getTVShowsByIds,
  pickMoviesPageFields,
  pickShortMoviesData,
  pickTVShowPageFields,
} from '../service/movie.service.js';
import { findAuthor } from '../service/user.service.js';
import { filterBy } from '../utils/filterBy.js';
import { searchBy } from '../utils/searchBy.js';

export const getAll = async (req, res) => {
  // #swagger.tags = ['Auth']
  try {
    const author = await findAuthor();
    if (!author) return res.status(404).json({ ok: false, message: 'User not found' });

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

    res.status(200).json({ ok: true, results: pickShortMoviesData(searchResult) });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Failed to get movies. Try again' });
  }
};

export const getOne = (type) => async (req, res) => {
  // #swagger.tags = ['Auth']
  try {
    const author = await findAuthor();
    if (!author) return res.status(404).json({ ok: false, message: 'User not found' });

    const movieId = req.params.id;

    const movie = type === 'movie' ? await getOneMovieById(movieId) : await getOneTVShowById(movieId);
    if (!movie) return res.status(404).json({ ok: false, message: 'Movie not found' });

    const result = type === 'movie' ? pickMoviesPageFields(movie) : pickTVShowPageFields(movie);
    res.status(200).json({ ok: true, ...result });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Failed to get movies. Try again' });
  }
};
