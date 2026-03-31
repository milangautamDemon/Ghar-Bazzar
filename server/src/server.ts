import express from "express";
import type { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "@db/database";
import authRouter from "@routes/auth/authRouter";
import favRouter from "@routes/fav/favRouter";
// import authDebugLogger from "@middlewares/authDebugLogger";
import { initializeRedis } from "@src/redisClient";
import productRouter from "@routes/product/productRouter";
import path from "path";

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
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));
connectDB();
void initializeRedis();

// app.use("/api", authDebugLogger);

app.use("/api/auth", authRouter);
app.use("/api", favRouter);
app.use("/api", productRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
