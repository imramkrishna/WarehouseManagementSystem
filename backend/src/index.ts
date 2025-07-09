import express from "express";
import { Request, Response } from "express";
import authRoutes from "./routes/auth.routes";
const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.get("/", async (req: Request, res: Response) => {
    res.send("Hello World");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});