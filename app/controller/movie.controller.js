import { getMediaByIds, pickShortMoviesData } from '../service/movie.service.js';
import { findAuthor } from '../service/user.service.js';

export const movieHandler = async (req, res) => {
  try {
    const author = await findAuthor();
    // if (!author) return res.status(404).json({ ok: false, message: 'User not found' });

    const movies = await getMediaByIds(author.movies_ids, 'movie');
    const tvShows = await getMediaByIds(author.tv_shows_ids, 'tv');

    // const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    // const isLoggedIn = Boolean(token);

    // if (isLoggedIn) {
    //   console.log(token);
    //   // const user = await findUser({});
    // }

    // const response = await axios.get('https://api.themoviedb.org/3/movie/top_rated', {
    //   params: {
    //     page: 1,
    //     api_key: MOVIEDB_KEY,
    //   },
    // });

    // const movies = response.data.results.map(({ id, title, genre_ids, poster_path, vote_average }) => ({
    //   id,
    //   name: title,
    //   genres: getGenresByIds(genre_ids),
    //   image_url: `https://image.tmdb.org/t/p/original${poster_path}`,
    //   rating: vote_average,
    // }));

    // const data = { ...response.data, results: [...movies] };

    const shortMovies = pickShortMoviesData([...movies, ...tvShows]);

    res.status(200).json({ ok: true, results: shortMovies });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Failed to get movies. Try again' });
  }
};
