import { Router } from 'express';
import { param, query } from 'express-validator';

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

movieRouter.get('/search', movieController.getBySearch);

movieRouter.get('/tv/:id', movieController.getById('tv'));
movieRouter.get('/movie/:id', movieController.getById('movie'));

movieRouter.patch(
  '/:media_type/:id',
  validate([param('media_type').isIn(Object.values(MOVIE_TYPE))]),
  movieController.markAsWatched,
);

export default movieRouter;
