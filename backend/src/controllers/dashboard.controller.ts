import { Request, Response } from "express";
import pool from "../utils/database";
import { StatusCodes } from "../interfaces/statusCodes";
export const dashboard = async (req: Request, res: Response) => {
    const { profile } = req.profile;
    const warehouseCount = await pool.query('SELECT COUNT(*) FROM warehouses');
    const supplierCount = await pool.query('SELECT COUNT(*) FROM suppliers');
    const inventoryCount = await pool.query('SELECT COUNT(*) FROM inventory');
    res.status(StatusCodes.OK).json({
        message: "Dashboard accessed successfully",
        profile,
        stats: {
            warehouses: Number(warehouseCount.rows[0].count),
            suppliers: Number(supplierCount.rows[0].count),
            inventory: Number(inventoryCount.rows[0].count)
        }
    });
};