import express from "express";
import type { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "@config/database";
import authRouter from "@routes/auth/authRouter";
import favRouter from "@routes/fav/favRouter";
// import authDebugLogger from "@middlewares/authDebugLogger";
import { initializeRedis } from "@src/redisClient";

dotenv.config({ path: "./.env" });
const PORT = process.env.PORT || 8000;

const app: Application = express();
app.use(
  cors({
    // origin: process.env.FRONTEND_URL, // frontend URL
    // credentials: true,
    origin: "*",
  }),
);
app.use(express.json());
connectDB();
void initializeRedis();

// app.use("/api", authDebugLogger);

app.use("/api/auth", authRouter);
app.use("/api", favRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
