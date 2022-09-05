import { HTTP_STATUS } from '../utils/constants.js';

export const validateToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(HTTP_STATUS.unauthorized).json({ ok: false, message: 'Access denied' });
    }

    res.locals.token = token;

    return next();
  } catch (error) {
    console.error('error: ', error);
    return res.status(HTTP_STATUS.unauthorized).json({ ok: false, message: 'Access denied' });
  }
};
