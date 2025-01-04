import express from "express";
import { deleteBlog, editBlogs, userDetail } from "./userController";
import { userAuth } from "../middleware/auth";
const userRouter = express.Router();

// retrieve user details.
userRouter.get("/:userId", userDetail);

// Edit an existing blog post.
userRouter.put("/:blogId", userAuth, editBlogs);

userRouter.delete("/:blogId", userAuth, deleteBlog);

export { userRouter };
