import { Router } from 'express';
import { body } from 'express-validator';

import { loginHandler, profileHandler } from '../controller/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { validateToken } from '../middleware/validateToken.middleware.js';

const authRouter = Router();

const MIN_PASSWORD_LENGTH = 5;

authRouter.post(
  '/auth/login',
  validate(
    body('email')
      .isEmail()
      .normalizeEmail({ all_lowercase: true, gmail_convert_googlemaildotcom: true })
      .withMessage({
        message: 'Invalid email format',
      }),
    body('password')
      .isLength({
        min: MIN_PASSWORD_LENGTH,
      })
      .withMessage({
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
      }),
  ),
  loginHandler,
);

authRouter.get('/auth/me', validateToken, profileHandler);

export default authRouter;
