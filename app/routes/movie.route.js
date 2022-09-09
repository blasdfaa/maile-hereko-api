import { Router } from 'express';
import { body, query } from 'express-validator';

import * as movieController from '../controller/movie.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { MOVIE_TYPE } from '../utils/constants.js';

const movieRouter = Router();

movieRouter.get(
  '/watched',
  validate([
    query('media_type').optional().isIn(Object.values(MOVIE_TYPE)).withMessage('Not found'),
    query('s').optional().isString(),
  ]),
  movieController.getWatched,
);

movieRouter.post(
  '/watched',
  validate([body('media_type').isIn(Object.values(MOVIE_TYPE))]),
  movieController.markAsWatched,
);

movieRouter.get('/search', movieController.getBySearch);

movieRouter.get('/tv/:id', movieController.getById('tv'));
movieRouter.get('/movie/:id', movieController.getById('movie'));

export default movieRouter;
