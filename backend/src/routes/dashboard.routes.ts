import { Router } from "express";
import { dashboard } from "../controllers/dashboard.controller";
import { tokenVerification } from "../middlewares/auth.middlewares";
const router = Router();

router.get("/dashboard", tokenVerification, dashboard);

export default router;
