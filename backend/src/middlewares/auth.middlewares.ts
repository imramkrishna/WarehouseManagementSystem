import { Request, Response, NextFunction } from "express";
import pool from "../utils/database";
import { StatusCodes } from "../interfaces/statusCodes";
import jwt from "jsonwebtoken";
export const tokenVerification = (req: Request, res: Response, next: NextFunction) => {
    const authheader = req.headers["authorization"];
    const token = authheader && authheader.split(" ")[1];
    if (!token) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
        return;
    }
    const decoded = jwt.verify(token, secret);
    if (!decoded) {
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