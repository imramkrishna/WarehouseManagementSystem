import express from 'express';
import { tokenVerification } from '../middlewares/auth.middlewares';
import updateInventory from '../controllers/updateControllers/updateInventory';
const router = express.Router();

router.put("/inventory", tokenVerification, updateInventory)
export default router;