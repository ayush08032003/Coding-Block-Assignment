import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { pool } from "../database/db";
import { CustomRequest } from "../middleware/auth";
import { commentTypes } from "./commentTypes";

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

      const parentBlogId = parentComment.rows[0].blog_id;
      if (parentBlogId !== blog_id) {
        next(
          createHttpError(
            400,
            "Parent Comment's Blog ID must match the current Blog ID"
          )
        );
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

const getComments = async (req: Request, res: Response, next: NextFunction) => {
  const { post_id, page = 1, pageSize = 10 } = req.query;

  if (!post_id) {
    next(createHttpError(400, "Please Provide Post Id"));
    return;
  }

  try {
    // Parse page and pageSize to integers
    const pageNumber = parseInt(page as string);
    const pageSizeNumber = parseInt(pageSize as string);

    // Make sure page and pageSize are positive numbers
    if (pageNumber <= 0 || pageSizeNumber <= 0) {
      next(createHttpError(400, "Page and pageSize must be positive numbers"));
      return;
    }

    // Calculate the OFFSET for pagination
    const offset = (pageNumber - 1) * pageSizeNumber;

    // Recursive query to fetch comments with pagination
    const result = await pool.query(
      `
        WITH RECURSIVE comment_tree AS (
          -- Base case: get the top-level comments (parent_id IS NULL)
          SELECT comment_id, description, parent_id, blog_id, user_id
          FROM comment
          WHERE blog_id = $1 AND parent_id IS NULL
          
          UNION ALL
          
          -- Recursive case: get the child comments
          SELECT c.comment_id, c.description, c.parent_id, c.blog_id, c.user_id
          FROM comment c
          INNER JOIN comment_tree ct ON ct.comment_id = c.parent_id
        )
        SELECT * FROM comment_tree
        LIMIT $2 OFFSET $3
      `,
      [
        parseInt(post_id as string), // blog_id
        pageSizeNumber, // LIMIT
        offset, // OFFSET
      ]
    );

    // Map the result rows to the commentTypes structure
    const commentData: commentTypes[] = result.rows.map((row) => ({
      comment_id: row.comment_id,
      description: row.description,
      parent_id: row.parent_id, // parent_id could be null
      blog_id: row.blog_id,
      user_id: row.user_id,
    }));

    // Return the mapped comments as a response with pagination info
    res.json({
      message: "Comments fetched successfully",
      page: pageNumber,
      pageSize: pageSizeNumber,
      commentData,
    });
  } catch (error) {
    console.error(error);
    next(createHttpError(500, "Internal Server Error - getComments"));
  }
};

export { addComment, getComments };
