import bcrypt from 'bcryptjs';

import authorModel from '../model/author.model.js';
import { HTTP_STATUS } from '../utils/constants.js';

const profileFields = {
  movies: { $size: '$movies_ids' },
  tv_shows: { $size: '$tv_shows_ids' },
  suggested: { $sum: [{ $size: '$suggested_movies_ids' }, { $size: '$suggested_tv_ids' }] },
  manual_suggested: { $size: '$manual_suggested_ids' },
  _id: 0,
};

export const login = async (req, res) => {
  try {
    const author = await authorModel.findOne({ email: req.body.email }).lean();
    if (!author) {
      return res.status(HTTP_STATUS.badRequest).json({ ok: false, message: 'Incorrect email or password' });
    }

    const isValidPassword = await bcrypt.compare(req.body.password, author.password_hash);
    if (!isValidPassword) {
      return res.status(HTTP_STATUS.badRequest).json({ ok: false, message: 'Incorrect email or password' });
    }

    const profileData = await authorModel.aggregate([{ $project: profileFields }]);

    return res.status(HTTP_STATUS.ok).json({ ok: true, token: author.token, ...profileData[0] });
  } catch (error) {
    console.error('error: ', error);
    return res.status(HTTP_STATUS.serverError).json({ ok: false, message: 'Failed to login. Try again' });
  }
};

export const getProfile = async (_req, res) => {
  try {
    const author = await authorModel.findOne({}).lean();
    if (!author) {
      return res.status(HTTP_STATUS.notFound).json({ ok: false, message: 'User not found' });
    }

    const isValidToken = author.token === res.locals.token;
    if (!isValidToken) {
      return res.status(HTTP_STATUS.unauthorized).json({ ok: false, message: 'Not authorized' });
    }

    const profileData = await authorModel.aggregate([{ $project: profileFields }]);

    return res.status(HTTP_STATUS.ok).json({ ok: true, results: { ...profileData[0] } });
  } catch (error) {
    console.error('error: ', error);
    return res.status(HTTP_STATUS.unauthorized).json({ ok: false, message: 'Server error' });
  }
};

export const logout = async (_req, res) => {
  try {
    const author = await authorModel.findOne({}).lean();
    if (!author) {
      return res.status(HTTP_STATUS.notFound).json({ ok: false, message: 'User not found' });
    }

    const isValidToken = author.token === res.locals.token;
    if (!isValidToken) {
      return res.status(HTTP_STATUS.unauthorized).json({ ok: false, message: 'Not authorized' });
    }

    return res.status(HTTP_STATUS.ok).json({ ok: true });
  } catch (error) {
    console.error('error: ', error);
    return res.status(HTTP_STATUS.unauthorized).json({ ok: false, message: 'Server error' });
  }
};
