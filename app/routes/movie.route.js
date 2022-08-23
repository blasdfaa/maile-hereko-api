import { Router } from 'express';

import * as movieController from '../controller/movie.controller.js';

const movieRouter = Router();

movieRouter.get('/watched', movieController.getWatched);
movieRouter.get('/search', movieController.getBySearch);
movieRouter.get('/tv/:id', movieController.getById('tv'));
movieRouter.get('/movie/:id', movieController.getById('movie'));

export default movieRouter;
