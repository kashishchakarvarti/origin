import cors from "cors";
import express from "express";
import { config } from "./config.js";
import { errorHandler } from "./middleware/auth.js";
import { authRouter } from "./routes/auth.js";
import { apiRouter } from "./routes/api.js";

export function createApp() {
  const app = express();
  app.use(
    cors({
      origin: config.corsOrigin,
      credentials: true,
    })
  );
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "crest-backend", ts: new Date().toISOString() });
  });

  app.use("/api/auth", authRouter);
  app.use("/api", apiRouter);

  app.use(errorHandler);
  return app;
}
