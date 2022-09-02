import { HTTP_STATUS } from '../utils/constants.js';

export default (req, res, next) => {
  try {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if (!token) {
      return res.status(HTTP_STATUS.unauthorized).json({ ok: false, message: 'Access denied' });
    }

    return next();
  } catch (error) {
    return res.status(HTTP_STATUS.unauthorized).json({ ok: false, message: 'Access denied' });
  }
};
