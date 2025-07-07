import { Request, Response, NextFunction } from "express";
import pool from "../utils/database";
import { StatusCodes } from "../interfaces/statusCodes";
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
    }
    next();
};
export const checkIfUserExists = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await pool.query(query, [email]);
    if(result.rows.length > 0){
        res.status(StatusCodes.BAD_REQUEST).json({message:"User already exists"});
        return;
    }
    next();
};