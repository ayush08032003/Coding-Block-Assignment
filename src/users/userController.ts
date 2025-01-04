import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { pool } from "../database/db";
import bcrypt from "bcrypt";
import { hash } from "crypto";
const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      next(createHttpError(400, "All fields are required"));
      return;
    }

    // checking for exsisting user
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUser) {
      next(
        createHttpError(
          400,
          "User already exists - Try With Different Email or Login..!"
        )
      );
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );

    res.json({
      message: "User registered successfully",
      userData: newUser.rows[0],
    });
    return;
  } catch (err) {
    next(createHttpError(500, "Internal Server Error"));
    return;
  }
  return; // this is not reachable..
};

const loginUser = (req: Request, res: Response, next: NextFunction) => {};

export { registerUser };
