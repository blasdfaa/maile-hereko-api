import { Router } from "express";
import { loginHandler, profileHandler, registerHandler } from "../controller/auth.js";
import { registerValidation } from "../lib/validations/auth.js";
import checkAuth from "../middleware/checkAuth.js";

const router = Router();

// Auth
router.post("/auth/register", registerValidation, registerHandler);
router.post("/auth/login", loginHandler);
router.get("/auth/me", checkAuth, profileHandler);

export default router;
