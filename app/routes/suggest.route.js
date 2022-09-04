import { Router } from 'express';
import { body } from 'express-validator';

import * as suggestController from '../controller/suggest.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { MOVIE_TYPE } from '../utils/constants.js';

const suggestRouter = Router();

suggestRouter.post(
  '/suggest',
  validate([
    body('media_type').isIn(Object.values(MOVIE_TYPE)),
    body('id').isMongoId().withMessage('Not valid id'),
  ]),
  suggestController.doSuggest,
);

suggestRouter.post(
  '/suggest/manual',
  validate([
    body('title', 'required field').isString(),
    body('link').optional().isURL().withMessage('Invalid movie URL'),
  ]),
  suggestController.doManualSuggest,
);

suggestRouter.get('/suggest', suggestController.getSuggestedMovies);

export default suggestRouter;
