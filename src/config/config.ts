import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

const config = {
  port: process.env.PORT || 3000,
  node_env: process.env.NODE_ENVIROMENT || "development",
  jwt_secret: process.env.JWT_SECRET || "secret",
  postgres_user: process.env.POSTGRES_USER,
  postgres_password: process.env.POSTGRES_PASSWORD,
  postgres_port: Number(process.env.POSTGRES_PORT),
};

export { config };
