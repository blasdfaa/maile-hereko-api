import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import { findAuthor, getAuthorData } from '../service/user.service.js';
import { HTTP_STATUS } from '../utils/constants.js';
import { formatValidationMessage } from '../utils/formatValidationMessage.js';

export const loginHandler = async (req, res) => {
  try {
    const errors = validationResult(req).formatWith(formatValidationMessage);
    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUS.badRequest).json({ ok: false, ...errors.mapped() });
    }

    const user = await findAuthor({ email: req.body.email });
    if (!user) {
      return res.status(HTTP_STATUS.badRequest).json({ ok: false, message: 'Incorrect email or password' });
    }

    const isValidPassword = await bcrypt.compare(req.body.password, user.password_hash);
    if (!isValidPassword) {
      return res.status(HTTP_STATUS.badRequest).json({ ok: false, message: 'Incorrect email or password' });
    }

    const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '30d' });

    return res.status(HTTP_STATUS.ok).json({ ok: true, token });
  } catch (error) {
    console.error('error: ', error);
    return res.status(HTTP_STATUS.serverError).json({ ok: false, message: 'Failed to login. Try again' });
  }
};

export const profileHandler = async (req, res) => {
  try {
    const author = await getAuthorData();
    if (!author) {
      return res.status(HTTP_STATUS.notFound).json({ ok: false, message: 'User not found' });
    }

    return res.status(HTTP_STATUS.ok).json({ ok: true, ...author });
  } catch (error) {
    console.error('error: ', error);
    return res.status(HTTP_STATUS.unauthorized).json({ ok: false, message: 'Access denied' });
  }
};
