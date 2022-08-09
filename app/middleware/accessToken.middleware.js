import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  try {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if (!token) return res.status(401).json({ ok: false, message: 'Access denied' });

    const decodedUser = jwt.verify(token, 'secret');
    req.userId = decodedUser.id;

    next();
  } catch (error) {
    console.error('error: ', error);
    return res.status(401).json({ ok: false, message: 'Access denied' });
  }
};
