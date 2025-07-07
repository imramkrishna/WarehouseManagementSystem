import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";
import { checkIfUserExists } from "../middlewares/auth.middlewares";
import rateLimit from "express-rate-limit";
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Too many requests, please try again later."
});
const router = Router();
router.use(limiter)
router.post("/register", checkIfUserExists, register);
router.post("/login", login);

export default router;