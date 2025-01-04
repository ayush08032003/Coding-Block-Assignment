import express, { Request, Response, NextFunction } from "express";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { registerUser } from "./users/userController";
import createHttpError from "http-errors";
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

// rsgister a new User
app.post("/register", registerUser);
// app.post("/register", (req: Request, res: Response, next: NextFunction) => {});

// app.post("/login");

app.use(globalErrorHandler);

export { app };
