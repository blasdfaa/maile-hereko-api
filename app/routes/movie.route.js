import { Router } from 'express';

import * as movieController from '../controller/movie.controller.js';

const movieRouter = Router();

movieRouter.get('/watched', movieController.getAll);
movieRouter.get('/tv/:id', movieController.getOne('tv'));
movieRouter.get('/movie/:id', movieController.getOne('movie'));

export default movieRouter;
