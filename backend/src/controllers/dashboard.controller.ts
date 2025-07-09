import { Request, Response } from "express";
export const dashboard = (req: Request, res: Response) => {
    const { profile } = req.profile;
    res.json({
        message: "Dashboard",
        profile,
    });
};