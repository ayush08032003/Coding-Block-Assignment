import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { pool } from "../database/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
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
    console.log(err);
    next(createHttpError(500, "Internal Server Error"));
    return;
  }
  return; // this is not reachable..
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      next(createHttpError(400, "All fields are required"));
      return;
    }

    let getUserData = null;
    try {
      getUserData = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
    } catch (err) {
      console.log(err);
      next(createHttpError(500, "Internal Server Error while Querying..!"));
      return;
    }

    //   console.log(getUserData.rows[0]);
    const hashedPassword = getUserData.rows[0].password;

    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      next(createHttpError(400, "Invalid Password"));
      return;
    }

    const token = jwt.sign(
      {
        userId: getUserData.rows[0].user_id,
        username: getUserData.rows[0].username,
      },
      config.jwt_secret,
      {
        expiresIn: "2 days",
      }
    );

    res.status(200).json({
      message: `Hi, ${getUserData.rows[0].username}`,
      token: token,
    });
    return;
  } catch (error) {
    console.log(error);
    next(createHttpError(500, "Internal Server Error"));
    return;
  }
  return;
};

export { registerUser, loginUser };
