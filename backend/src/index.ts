import { createApp } from "./app.js";
import { config } from "./config.js";
import { startOrderAlgoTicker } from "./algo/ticker.js";
import { db } from "./data/store.js";
import { prisma } from "./data/prisma.js";

async function main() {
  const count = await prisma.user.count();
  if (count === 0) {
    console.log("[crest] Empty database — seeding…");
    await db.reset();
  }

  startOrderAlgoTicker();

  const app = createApp();
  app.listen(config.port, () => {
    console.log(`[crest] API listening on http://localhost:${config.port}`);
    console.log(`[crest] Demo login: ${config.demoUser.email} / ${config.demoUser.password}`);
    console.log(`[crest] Postgres: ${config.databaseUrl.replace(/:[^:@]+@/, ":****@")}`);
    console.log(`[crest] Order algo interval: ${config.orderAlgoIntervalMs}ms`);
  });
}

main().catch((err) => {
  console.error("[crest] Failed to start", err);
  process.exit(1);
});
