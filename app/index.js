import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

import authRouter from './routes/auth.route.js';
import movieRouter from './routes/movie.route.js';
import suggestRouter from './routes/suggest.route.js';

const PORT = process.env.PORT || 8000;

const app = express();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.info('connect to db');
  })
  .catch((err) => {
    console.error(err);
  });

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRouter);
app.use('/api', movieRouter);
app.use('/api', suggestRouter);

// 404
app.use((_, res) => {
  return res.status(404).json({ ok: false, message: 'endpoint not found' });
});

app.listen(PORT, (err) => {
  if (err) console.error(err);

  console.info(`server listen on ${PORT} port`);
});
