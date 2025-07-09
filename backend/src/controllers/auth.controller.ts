import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import pool from "../utils/database";
import bcrypt from "bcrypt";
import { StatusCodes } from "../interfaces/statusCodes";
export const register = async (req: Request, res: Response) => {
    if (!req.body) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Body is required" });
        return;
    }
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "All fields are required" });
        return;
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const query = `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id`;
    const values = [name, email, hashedPassword];
    await pool.query(query, values);
    res.status(StatusCodes.CREATED).json({ message: "User created successfully" });
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "All fields are required" });
        return;
    }
    const query = `SELECT * FROM users WHERE email = $1 AND password = $2`;
    const result = await pool.query(query, [email, password]);
    if (result.rows.length === 0) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "User not found" });
        return;
    }
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
        return;
    }
    const userDetails = result.rows[0];
    const refreshToken = jwt.sign({ userDetails }, secret, { expiresIn: "7d" });
    res.status(StatusCodes.OK).json({ message: "verified", refreshToken });
};
export const accessToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Refresh token is required" });
        return;
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
        return;
    }
    const decoded = jwt.verify(refreshToken, secret);
    if (!decoded) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid refresh token" });
        return;
    }
    const id = decoded;
    const token = jwt.sign(id, secret);
    res.status(StatusCodes.OK).json({ token });
};