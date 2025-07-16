import express from "express";
import { Request, Response } from "express";
import authRoutes from "./routes/auth.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import cors from "cors";
import addRoutes from "./routes/add.routes"
import updateRoutes from "./routes/update.routes";
const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/profile", dashboardRoutes);
app.use("/api/add", addRoutes)
app.use("/api/update", updateRoutes);
app.get("/", async (req: Request, res: Response) => {
  res.send("Backend is running....");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
