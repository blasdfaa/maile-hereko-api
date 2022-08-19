import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import { findAuthor, getAuthorData } from '../service/user.service.js';
import { HTTP_STATUS } from '../utils/constants.js';
import { formatValidationMessage } from '../utils/formatValidationMessage.js';

export const loginHandler = async (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Log in user'
  /* #swagger.parameters['body'] = {
        in: 'body',
        required: 'true',
        type: 'object',
        schema: { $ref: '#/definitions/Credentials' }
} */
  /* #swagger.responses[201] = {
        description: 'Login success',
        schema: { $ref: '#/definitions/SuccessLogin' }
} */
  /* #swagger.responses[400] = {
        description: 'Invalid email',
        schema: { $ref: '#/definitions/InvalidEmail' }
} */
  /* #swagger.responses[400] = {
        description: 'Invalid password',
        schema: { $ref: '#/definitions/InvalidPassword' }
} */
  /* #swagger.responses[400] = {
        description: 'Incorrect user data',
        schema: { $ref: '#/definitions/IncorrectCredentials' }
} */
  /* #swagger.responses[500] = {
        description: 'Some error',
        schema: { $ref: '#/definitions/FailedLogin' }
} */
  try {
    const errors = validationResult(req).formatWith(formatValidationMessage);
    if (!errors.isEmpty()) return res.status(HTTP_STATUS.badRequest).json({ ok: false, ...errors.mapped() });

    const user = await findAuthor({ email: req.body.email });
    if (!user) {
      return res.status(HTTP_STATUS.badRequest).json({ ok: false, message: 'Incorrect email or password' });
    }

    const isValidPassword = await bcrypt.compare(req.body.password, user.password_hash);
    if (!isValidPassword) {
      return res.status(HTTP_STATUS.badRequest).json({ ok: false, message: 'Incorrect email or password' });
    }

    const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '30d' });

    res.status(HTTP_STATUS.ok).json({ ok: true, token });
  } catch (error) {
    console.error('error: ', error);
    res.status(HTTP_STATUS.serverError).json({ ok: false, message: 'Failed to login. Try again' });
  }
};

export const profileHandler = async (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Get author data'
  /* #swagger.parameters['authorization'] = {
        in: 'header',
        required: 'true',
        type: 'string',
} */
  /* #swagger.responses[200] = {
        description: 'Success',
        schema: { $ref: '#/definitions/Author' }
} */
  /* #swagger.responses[401] = {
        description: 'Access denied',
        schema: { $ref: '#/definitions/IncorrectAccessToken' }
} */
  /* #swagger.responses[404] = {
        description: 'User not found',
        schema: { $ref: '#/definitions/NotFoundUser' }
} */
  try {
    const author = await getAuthorData();
    if (!author) return res.status(HTTP_STATUS.notFound).json({ ok: false, message: 'User not found' });

    res.status(HTTP_STATUS.ok).json({ ok: true, ...author });
  } catch (error) {
    console.error('error: ', error);
    res.status(HTTP_STATUS.unauthorized).json({ ok: false, message: 'Access denied' });
  }
};
