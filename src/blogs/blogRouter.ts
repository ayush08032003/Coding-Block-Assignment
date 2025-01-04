import express from "express";
import { createBlog, getAllBlogs } from "./blogController";
import { userAuth } from "../middleware/auth";
const blogRouter = express.Router();

blogRouter.post("/", userAuth, createBlog); // create a new blog
blogRouter.get("/", getAllBlogs);

export { blogRouter };
