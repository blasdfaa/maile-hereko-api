import { Router } from 'express';
import { query } from 'express-validator';

import * as movieController from '../controller/movie.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { MOVIE_TYPE } from '../utils/constants.js';

const movieRouter = Router();

movieRouter.get(
  '/watched',
  validate([query('movie_type').isIn(Object.values(MOVIE_TYPE)).withMessage('Not found')]),
  movieController.getWatched,
);
movieRouter.get('/search', movieController.getBySearch);
movieRouter.get('/tv/:id', movieController.getById('tv'));
movieRouter.get('/movie/:id', movieController.getById('movie'));

export default movieRouter;
