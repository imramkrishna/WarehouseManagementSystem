import { Request, Response } from "express";
import pool from "../utils/database";
import { StatusCodes } from "../interfaces/statusCodes";
async function warehouses(req: Request, res: Response) {
    try {
        const warehouses = await pool.query('SELECT * FROM warehouses');
        res.status(StatusCodes.OK).json({
            message: "Warehouses accessed successfully",
            warehouses: warehouses.rows
        });
    } catch (error) {
        console.error("Error fetching warehouses:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Error accessing warehouses"
        });
    }

}
export default warehouses;