import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import fs from "fs";

import authRouter from "./routes/auth.js";
import movieRouter from "./routes/movie.js";

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

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", authRouter);
app.use("/api", movieRouter);

// Swagger
const swaggerFile = JSON.parse(fs.readFileSync("./app/swagger_docs.json"));
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerFile, { explorer: true }));

// 404
app.use((_, res) => {
  res.status(404).json({ ok: false, message: "endpoint not found" });
});

app.listen(PORT, (err) => {
  if (err) console.log(err);

  console.log(`server listen on ${PORT} port`);
});
