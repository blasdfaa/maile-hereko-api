import { Router } from 'express';

import { movieHandler } from '../controller/movie.controller.js';

const movieRouter = Router();

movieRouter.get('/movie', movieHandler);

export default movieRouter;
