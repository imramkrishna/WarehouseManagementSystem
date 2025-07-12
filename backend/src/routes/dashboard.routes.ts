import { Router } from "express";
import { dashboard } from "../controllers/dashboard.controller";
import { tokenVerification } from "../middlewares/auth.middlewares";
import forgotPassword from "../controllers/forgotPassword.controller";
import inventory from "../controllers/inventory.controller";
const router = Router();

router.get("/dashboard", tokenVerification, dashboard);
router.put("/forgotPassword", forgotPassword);
router.get("/inventory", tokenVerification, inventory);

export default router;
