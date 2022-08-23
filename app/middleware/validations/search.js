import { query } from 'express';

export const searchParamsValidator = [query('s').isString().withMessage('')];
