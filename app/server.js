import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { registerValidation } from "./lib/validations/auth.js";
import checkAuth from "./middleware/checkAuth.js";
import { loginHandler, profileHandler, registerHandler } from "./controller/auth.js";

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

app.post("/auth/register", registerValidation, registerHandler);
app.post("/auth/login", loginHandler);
app.get("/auth/me", checkAuth, profileHandler);

app.listen(PORT, (err) => {
  if (err) console.log(err);

  console.log(`server listen on ${PORT} port`);
});
