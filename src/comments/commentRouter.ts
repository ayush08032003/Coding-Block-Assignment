import express from "express";
import { addComment } from "./commentController";
import { userAuth } from "../middleware/auth";
const commentRouter = express.Router();

commentRouter.post("/", userAuth, addComment);

export { commentRouter };
