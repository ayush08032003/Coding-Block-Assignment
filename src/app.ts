import express, { Request, Response, NextFunction } from "express";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { loginUser, registerUser } from "./users/userController";
import { userRouter } from "./users/userRouter";
import createHttpError from "http-errors";
import { blogRouter } from "./blogs/blogRouter";
import { commentRouter } from "./comments/commentRouter";
const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).send("Server is Healthy..!");
  } catch (err) {
    next(createHttpError(500, "Internal Server Error"));
    return;
  }
  return;
});

app.post("/register", registerUser); // register a new user
app.post("/login", loginUser); // login a new User.
app.use("/users", userRouter);

app.use("/blogs", blogRouter);
app.use("/comments", commentRouter);

app.use(globalErrorHandler);

export { app };
