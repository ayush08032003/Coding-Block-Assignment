import { Request, Response, NextFunction } from "express";
import { HttpError } from "http-errors";
import { config } from "../config/config";

const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message,
    ErrorStack: config.node_env === "development" ? err.stack : undefined,
  });
  return;
};

export { globalErrorHandler };
