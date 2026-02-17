import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";

export default function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  // Fallback
  res.status(500).json({ message: "Internal Server Error" });
}
