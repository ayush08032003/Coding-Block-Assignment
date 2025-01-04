import pkg from "pg";
const { Pool } = pkg;
import { config } from "../config/config";

const pool = new Pool({
  user: config.postgres_user,
  password: config.postgres_password,
  host: "localhost",
  port: config.postgres_port || 5432,
  database: "codingblocks",
});

export { pool };
