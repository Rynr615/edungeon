// server/src/index.ts
import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import moduleRoutes from "../src/routes/moduleRoutes";

dotenv.config();

import "./config/firebase.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api/modules", moduleRoutes)

// Routes
app.use("/api/user", userRoutes);

// Endpoint Health Check
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Server Edungeon berjalan dengan baik",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`[SERVER] Running on http://localhost:${PORT}`);
});