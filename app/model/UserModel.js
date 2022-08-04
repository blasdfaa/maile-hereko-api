import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    movies_ids: Array,
    tv_shows_ids: Array,
    suggestions_ids: Array,
    manual_suggestions_ids: Array,
  },
  { timestamps: true },
);

export default mongoose.model("user", userSchema);
