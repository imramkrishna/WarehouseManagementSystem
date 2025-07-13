import { Request, Response } from "express";
import pool from "../utils/database";
import { StatusCodes } from "../interfaces/statusCodes";
async function suppliers(req: Request, res: Response) {
    try {
        const suppliers = await pool.query('SELECT * FROM suppliers');
        res.status(StatusCodes.OK).json({
            message: "Suppliers accessed successfully",
            suppliers: suppliers.rows
        });
    } catch (error) {
        console.error("Error fetching suppliers:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Error accessing suppliers"
        });
    }
}
export default suppliers;