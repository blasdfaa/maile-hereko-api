import { validationResult } from 'express-validator';

import { HTTP_STATUS } from '../utils/constants.js';

export const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((validation) => validation.run(req)));

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(HTTP_STATUS.badRequest).json({
      ok: false,
      errors: errors.array(),
    });
  }

  return next();
};
