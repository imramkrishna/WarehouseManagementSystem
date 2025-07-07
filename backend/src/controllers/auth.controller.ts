import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import pool from "../utils/database";
import bcrypt from "bcrypt";
import { StatusCodes } from "../interfaces/statusCodes";
export const register = async(req: Request, res: Response) => {
    if(!req.body){
        res.status(StatusCodes.BAD_REQUEST).json({message:"Body is required"});
        return;
    }
    const { name, email, password } = req.body;
    if(!name || !email || !password){
        res.status(StatusCodes.BAD_REQUEST).json({message:"All fields are required"});
        return;
    }
    const hashedPassword=await bcrypt.hash(password,10)
    const query = `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id`;
    const values = [name, email, hashedPassword];
    await pool.query(query, values);
    res.status(StatusCodes.CREATED).json({message:"User created successfully"});
};

export const login = async(req: Request, res: Response) => {
    const { email, password } = req.body;
};