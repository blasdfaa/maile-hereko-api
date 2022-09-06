import { Router } from 'express';
import { body } from 'express-validator';

import * as authController from '../controller/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { validateToken } from '../middleware/validateToken.middleware.js';

const authRouter = Router();

const MIN_PASSWORD_LENGTH = 5;

authRouter.post(
  '/auth/login',
  validate([
    body('email').isEmail().withMessage({
      message: 'Invalid email format',
    }),
    body('password')
      .isLength({
        min: MIN_PASSWORD_LENGTH,
      })
      .withMessage({
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
      }),
  ]),
  authController.login,
);

authRouter.get('/auth/me', validateToken, authController.getProfile);
authRouter.delete('/auth/logout', validateToken, authController.logout);

export default authRouter;
