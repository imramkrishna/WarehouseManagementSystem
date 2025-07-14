import express from "express"
import { tokenVerification } from "../middlewares/auth.middlewares";
import addInventory from "../controllers/addControllers/addInventory.controller";
import addSupplier from "../controllers/addControllers/addSupplier.controller";
import addOrder from "../controllers/addControllers/addOrders.controller";
const router = express.Router();
router.post("/addInventory", tokenVerification, addInventory);
router.post("/addSupplier", tokenVerification, addSupplier);
router.post("/addOrders", tokenVerification, addOrder)
export default router;