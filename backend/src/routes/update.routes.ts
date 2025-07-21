import express from 'express';
import { tokenVerification } from '../middlewares/auth.middlewares';
import updateInventory from '../controllers/updateControllers/updateInventory.controller';
import updateOrder from '../controllers/updateControllers/updateOrder.controller';
import updateWarehouse from '../controllers/updateControllers/updateWarehouse.controller';
import updateSupplier from '../controllers/updateControllers/updateSupplier.controller';
const router = express.Router();

router.put("/inventory", tokenVerification, updateInventory)
router.put("/orders/:id", tokenVerification, updateOrder)
router.put("/suppliers/:id", tokenVerification, updateSupplier) // Assuming updateInventory is used for suppliers as well
router.put("/warehouses/:id", tokenVerification, updateWarehouse) // Assuming updateInventory is
export default router;