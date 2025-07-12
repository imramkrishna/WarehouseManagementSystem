import { Request, Response } from "express";
import pool from "../utils/database";
import { StatusCodes } from "../interfaces/statusCodes";
async function inventory(req: Request, res: Response) {
    const inventoryItems = await pool.query('SELECT * FROM inventory');
    res.status(StatusCodes.OK).json({
        message: "Inventory accessed successfully",
        items: inventoryItems.rows
    });

}
export default inventory;