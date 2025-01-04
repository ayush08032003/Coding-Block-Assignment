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
    // Get page and limit from query parameters, set default values if not provided
    const page = parseInt(req.query.page as string) || 1;  // Default page to 1
    const limit = parseInt(req.query.limit as string) || 10;  // Default limit to 10

    // Calculate the offset
    const offset = (page - 1) * limit;

    // Query to get total count of blogs for pagination info
    const countResult = await pool.query("SELECT COUNT(*) FROM blog");
    const totalBlogs = parseInt(countResult.rows[0].count);

    // Query to get paginated blogs
    const allBlogs = await pool.query(
      "SELECT * FROM blog  LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    // Calculate total number of pages
    const totalPages = Math.ceil(totalBlogs / limit);

    // Respond with the paginated data
    res.json({
      message: "All Blogs",
      blogData: allBlogs.rows,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalBlogs: totalBlogs,
        blogsPerPage: limit,
      },
    });
  } catch (error) {
    console.log(error);
    next(
      createHttpError(
        500,
        "Internal Server Error - getAllBlogs - blogController"
      )
    );
  }
};

const getSingleBlock = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blogId = req.params.blogId;
    const userId = (req as CustomRequest).userId;
    // const userId = 2;

    const getBlog = await pool.query(
      "SELECT * FROM blog WHERE blog_id=$1 AND user_id=$2",
      [blogId, userId]
    );
    if (getBlog.rows.length === 0) {
      next(createHttpError(404, "Blog Not Found"));
      return;
    }

    res.json({
      message: "Blog You Requested",
      blogData: getBlog.rows[0],
    });
    return;
  } catch (error) {
    console.log(error);
    next(
      createHttpError(
        500,
        "Internal Server Error - getSingleBlock - blogController"
      )
    );
    return;
  }
  return;
};



export { createBlog, getAllBlogs, getSingleBlock };
