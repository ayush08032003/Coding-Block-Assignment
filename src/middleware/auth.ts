import { config } from "../config/config";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

export interface CustomRequest extends Request {
  userId: number;
  username: string;
}

export interface CustomJWTPayload extends jwt.JwtPayload {
  userId: number;
  username: string;
}

const userAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", ""); // Extract the token from the Authorization header

    if (!token) {
      next(createHttpError(401, "Please Provide Token"));
      return;
    }

    try {
      const decode = jwt.verify(token, config.jwt_secret) as CustomJWTPayload;
      (req as CustomRequest).userId = decode.userId as number;
      (req as CustomRequest).username = decode.username as string;

      next();
    } catch (error) {
      next(createHttpError(401, "Invalid Token"));
      return;
    }
  } catch (error) {
    console.log(error);
    next(createHttpError(500, "Internal Server Error - userAuth"));
    return;
  }
  return;
};

export { userAuth };
