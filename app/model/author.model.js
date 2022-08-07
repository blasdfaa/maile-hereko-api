import mongoose from 'mongoose';

const authorSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  movies_ids: [Number],
  tv_shows_ids: [Number],
  suggestions_ids: [Number],
  manual_suggestions_ids: [Number],
});

export default mongoose.model('Author', authorSchema, 'author');