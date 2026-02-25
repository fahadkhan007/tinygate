import { configDotenv } from "dotenv";

configDotenv();

export const { PORT, DB_URL, JWT_SECRET, JWT_EXPIRES_IN, NODE_ENV } = process.env;

