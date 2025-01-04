import express from "express";
import { userDetail } from "./userController";
const userRouter = express.Router();

// retrieve user details.
userRouter.get("/:userId", userDetail);

// Edit an existing blog post.
userRouter.put("/:blogId");

userRouter.delete("/:blogId");

export { userRouter };
