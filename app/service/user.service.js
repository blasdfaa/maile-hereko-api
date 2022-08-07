import pick from 'lodash.pick';

import authorModel from '../model/author.model.js';

export const findAuthor = async () => {
  return authorModel.findOne({}).lean();
};

export const getAuthorData = async () => {
  const author = await findAuthor({});

  return pick(author, ['movies_ids', 'tv_shows_ids', 'suggestions_ids', 'manual_suggestions_ids']);
};
