import express from "express";
import { Request, Response } from "express";
import authRoutes from "./routes/auth.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import cors from "cors";
import updateRoutes from "./routes/add.routes"
const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/profile", dashboardRoutes);
app.use("/api/add", updateRoutes)
app.get("/", async (req: Request, res: Response) => {
  res.send("Backend is running....");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
