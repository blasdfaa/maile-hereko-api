import mongoose from 'mongoose';

const authorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  movies_ids: [Number],
  tv_shows_ids: [Number],
  suggested_movies_ids: [Number],
  suggested_tv_ids: [Number],
  manual_suggested_ids: [{ title: String, link: String }],
});

export default mongoose.model('Author', authorSchema, 'author');
