import { Router } from "express";
import { loginHandler, profileHandler, registerHandler } from "../controller/auth.js";
import { registerValidation } from "../lib/validations/auth.js";
import checkAuth from "../middleware/checkAuth.js";

const authRouter = Router();

// Auth
authRouter.post("/auth/register", registerValidation, registerHandler);
authRouter.post("/auth/login", loginHandler);
authRouter.get("/auth/me", checkAuth, profileHandler);

export default authRouter;
