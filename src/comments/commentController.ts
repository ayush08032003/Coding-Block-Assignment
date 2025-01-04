import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { pool } from "../database/db";
import { CustomRequest } from "../middleware/auth";

const addComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { description, parent_id, blog_id } = req.body;
    const userId = (req as CustomRequest).userId;

    if (!description || !blog_id) {
      next(createHttpError(400, "Please Provide Description and Blog Id Both"));
      return;
    }

    // check if the blog exists
    const blogData = await pool.query("SELECT * FROM blog WHERE blog_id = $1", [
      blog_id,
    ]);
    if (blogData.rows.length === 0) {
      next(createHttpError(404, "Blog Not Found"));
      return;
    }

    // check for parentId, like this id should be present or not..
    if (parent_id) {
      const parentComment = await pool.query(
        "SELECT * FROM comment WHERE comment_id = $1",
        [parent_id]
      );
      if (parentComment.rows.length === 0) {
        next(createHttpError(404, "Parent Comment Not Found"));
        return;
      }
    }
    const parentCommentId = parent_id ? parent_id : null;

    await pool
      .query(
        "INSERT INTO comment (description, blog_id, user_id, parent_id) VALUES ($1, $2, $3, $4) RETURNING *",
        [description, blog_id, userId, parentCommentId]
      )
      .then((data) => {
        res.json({
          message: "Comment Added Successfully",
          commentData: data.rows[0],
        });
      })
      .catch((error) => {
        console.log(error);
        next(createHttpError(500, "Internal Server Error - addComment"));
        return;
      });

    // return;
  } catch (error) {
    console.log(error);
    next(createHttpError(500, "Internal Server Error - addComment"));
    return;
  }
};

export { addComment };
