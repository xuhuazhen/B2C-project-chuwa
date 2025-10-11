// Server/app.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import { AppError } from "./utils/appError.js";
import productRouter from "./routers/productRouter.js";
import uploadRoutes from "./routers/uploadRoutes.js"; // ⬅️ 新增

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Applying middleware
const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public"))); // serve static files

app.get("/", (req, res) => {
  res.json("Hello");
});

app.use("/api/product", productRouter);
app.use("/api", uploadRoutes); // ⬅️ 新增：/api/upload/sign

// Catch-all route for unsupported paths
app.use((req, res, next) => {
  next(
    new AppError("Sorry, we couldn’t find the page you’re looking for.", 404)
  );
});

export default app;
