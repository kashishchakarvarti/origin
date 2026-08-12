import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const config = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || "crest-dev-secret-change-me",
  jwtExpiresIn: "7d",
  orderAlgoIntervalMs: Number(process.env.ORDER_ALGO_INTERVAL_MS || 10_000),
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  databaseUrl:
    process.env.DATABASE_URL ||
    "postgresql://crest:crest@localhost:5433/crest?schema=public",
  dbPath: path.join(__dirname, "..", "data", "db.json"),
  demoUser: {
    email: "user@mail.com",
    password: "user",
    name: "Kashish",
  },
} as const;
