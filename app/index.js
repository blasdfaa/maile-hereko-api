import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import authRouter from "./routes/auth.js";

const PORT = process.env.PORT || 8000;

const app = express();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connect to db");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use("/api", authRouter);

// 404
app.use((_, res) => {
  res.status(404).json({ ok: false, message: "endpoint not found" });
});

app.listen(PORT, (err) => {
  if (err) console.log(err);

  console.log(`server listen on ${PORT} port`);
});
