import { Router } from "express";
import { dashboard } from "../controllers/dashboard.controller";
import { tokenVerification } from "../middlewares/auth.middlewares";
import forgotPassword from "../controllers/forgotPassword.controller";
const router = Router();

router.get("/dashboard", tokenVerification, dashboard);
router.put("/forgotPassword", forgotPassword);

export default router;
