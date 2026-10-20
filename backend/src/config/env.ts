import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
  "DATABASE_URL",
  "BACKEND_URL",
  "FRONTEND_URL",
  "JWT_ACCESS_TOKEN_SECRET",
  "JWT_REFRESH_TOKEN_SECRET",
] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`[Config Error]: Missing required environment variable: ${envVar} in .env file`);
  }
}

export const env = {
  PORT: Number(process.env.PORT) || 5000,
  BACKEND_URL: process.env.BACKEND_URL as string,
  FRONTEND_URL: process.env.FRONTEND_URL as string,
  DATABASE_URL: process.env.DATABASE_URL as string,
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET as string,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET as string,
  NODE_ENV: process.env.NODE_ENV || "development",
} as const;

export type Env = typeof env;
