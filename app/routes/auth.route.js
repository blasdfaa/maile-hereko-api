import { Router } from 'express';

import { loginHandler, profileHandler } from '../controller/auth.controller.js';
import accessTokenMiddleware from '../middleware/accessToken.middleware.js';

const authRouter = Router();

authRouter.post('/auth/login', loginHandler);
authRouter.get('/auth/me', accessTokenMiddleware, profileHandler);

export default authRouter;
