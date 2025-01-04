import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { CustomRequest } from "../middleware/auth";
import { pool } from "../database/db";

const createBlog = async (req: Request, res: Response, next: NextFunction) => {
  //   res.json("Blog Created Successfully");
  try {
    const userId = (req as CustomRequest).userId;
    const { description } = req.body;

    if (!description) {
      next(createHttpError(400, "Description is required for Creating a Blog"));
      return;
    }

    const newBlog = await pool.query(
      "INSERT INTO blog (description, user_id) VALUES ($1, $2) RETURNING *",
      [description, userId]
    );

    res.json({
      message: "Blog Created Successfully",
      blogData: newBlog.rows[0],
    });

    return;
  } catch (error) {
    console.log(error);
    next(
      createHttpError(
        500,
        "Internal Server Error - createBlog - blogController"
      )
    );
    return;
  }
  return; // this should not be reachable..
};

const getAllBlogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allBlogs = await pool.query("SELECT * FROM blog");
    res.json({
      message: "All Blogs",
      blogData: allBlogs.rows,
    });
    return;
  } catch (error) {
    console.log(error);
    next(
      createHttpError(
        500,
        "Internal Server Error - getAllBlogs - blogController"
      )
    );
    return;
  }
  return;
};

export { createBlog, getAllBlogs };