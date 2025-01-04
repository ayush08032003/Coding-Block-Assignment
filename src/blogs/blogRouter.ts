import express from "express";
import { createBlog, getAllBlogs, getSingleBlock } from "./blogController";
import { userAuth } from "../middleware/auth";
import { deleteBlog, editBlogs } from "../users/userController";
const blogRouter = express.Router();

blogRouter.post("/", userAuth, createBlog); // create a new blog
blogRouter.get("/", getAllBlogs); // get all blogs
blogRouter.get("/:blogId", userAuth, getSingleBlock); // get single blog which is the user is Authentuicated..!
blogRouter.put("/:blogId", userAuth, editBlogs); // Edit an existing blog post.
blogRouter.delete("/:blogId", userAuth, deleteBlog) // Delete an existing blog post.
export { blogRouter };
