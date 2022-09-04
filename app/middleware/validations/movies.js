import { query } from 'express-validator';

import { MOVIE_TYPE } from '../../utils/constants.js';

export const watchedMoviesValidator = [
  query('movie_type').isIn(Object.values(MOVIE_TYPE)).withMessage('Not found'),
];
