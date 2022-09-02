import mongoose from 'mongoose';

const authorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  movies_ids: [mongoose.Types.ObjectId],
  tv_shows_ids: [mongoose.Types.ObjectId],
  suggested_movies_ids: [mongoose.Types.ObjectId],
  suggested_tv_ids: [mongoose.Types.ObjectId],
  manual_suggested_ids: [{ title: String, link: String }],
});

export default mongoose.model('Author', authorSchema, 'author');
