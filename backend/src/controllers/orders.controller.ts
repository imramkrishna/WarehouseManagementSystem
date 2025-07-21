import { Request, Response } from "express";
import pool from "../utils/database";
import { StatusCodes } from "../interfaces/statusCodes";

async function orders(req: Request, res: Response) {
    try {
        const query = `SELECT * FROM orders`;
        const result = await pool.query(query);
        if (result.rows.length === 0) {
            res.status(StatusCodes.NOT_FOUND).json({ message: "No orders found" });
            return;
        }
        res.status(StatusCodes.OK).json(result.rows);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
}
export default orders;
