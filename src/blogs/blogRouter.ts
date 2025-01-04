import express from "express";
import { createBlog, getAllBlogs, getSingleBlock } from "./blogController";
import { userAuth } from "../middleware/auth";
const blogRouter = express.Router();

blogRouter.post("/", userAuth, createBlog); // create a new blog
blogRouter.get("/", getAllBlogs); // get all blogs
blogRouter.get("/:blogId", userAuth, getSingleBlock); // get single blog which is the user is Authentuicated..!

export { blogRouter };
