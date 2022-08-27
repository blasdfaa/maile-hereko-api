import { Router } from 'express';

import * as suggestController from '../controller/suggest.controller.js';

const suggestRouter = Router();

suggestRouter.post('/suggest', suggestController.doSuggest);
suggestRouter.get('/suggest', suggestController.getSuggestedMovies);

export default suggestRouter;
