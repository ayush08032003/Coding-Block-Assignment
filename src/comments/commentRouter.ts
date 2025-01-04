import express from "express";
import { addComment, getComments } from "./commentController";
import { userAuth } from "../middleware/auth";
const commentRouter = express.Router();

commentRouter.post("/", userAuth, addComment); // endpoint for adding comment
commentRouter.get("/", getComments); // endpoint for getting comments - all nested comments

export { commentRouter };
