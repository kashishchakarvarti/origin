import { db } from "../data/store.js";
import { prisma } from "../data/prisma.js";

async function main() {
  await db.reset();
  console.log("[crest] PostgreSQL seeded with fresh demo data (~₹5L portfolio).");
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
