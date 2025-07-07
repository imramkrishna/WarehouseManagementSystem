import express from "express";
import { Request, Response } from "express";
import authRoutes from "./routes/auth.routes";
import redis from "./utils/redis";
const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.get("/", async (req: Request, res: Response) => {
    await redis.set("test5", "Hello World");
    const value = await redis.get("test5");
    console.log(value);
    res.send(value);
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});