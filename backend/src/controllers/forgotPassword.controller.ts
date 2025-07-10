import { Request, Response } from "express";
import bcrypt from "bcrypt";
import pool from "../utils/database";
import { StatusCodes } from "../interfaces/statusCodes";
async function forgotPassword(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Email is required" });
        return;
    }
    if (!password) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Password is required" });
        return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `UPDATE users SET password=$2 WHERE email = $1`;
    const result = await pool.query(query, [email, hashedPassword])
    if (result.rowCount === 0) {
        res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
        return;
    }
    res.status(StatusCodes.OK).json({ message: "Password updated successfully" });

}
export default forgotPassword;