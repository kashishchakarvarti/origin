#!/usr/bin/env node
/**
 * CLI runner for the fake-order algorithm.
 *
 * Usage:
 *   node algo/run.mjs
 *   node algo/run.mjs --days=14 --seed=42
 *   npm run algo:orders
 *
 * Prints a day-by-day report using demo businesses (no browser / localStorage).
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { simulateOrders, expectedOrdersForDay } from "./simulate-orders.mjs";
import { getHoliday } from "./holidays.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const opts = { days: 30, seed: 42, json: false };
  for (const arg of argv) {
    if (arg.startsWith("--days=")) opts.days = Number(arg.slice(7)) || 30;
    else if (arg.startsWith("--seed=")) opts.seed = Number(arg.slice(7)) || 42;
    else if (arg === "--json") opts.json = true;
  }
  return opts;
}

/** Demo portfolio mirroring Crest categories / countries */
function demoBusinesses() {
  return [
    {
      id: "biz_demo_1",
      name: "GlowNest Beauty",
      country: "USA",
      category: "Beauty",
      status: "live",
      orders: 1200,
      currentSellingPrice: 4500,
      launchScore: 92,
      createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
    },
    {
      id: "biz_demo_2",
      name: "PureHome Living",
      country: "India",
      category: "Home",
      status: "growing",
      orders: 420,
      currentSellingPrice: 3200,
      launchScore: 84,
      createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    },
    {
      id: "biz_demo_3",
      name: "ApexFit Gear",
      country: "UK",
      category: "Fitness",
      status: "live",
      orders: 800,
      currentSellingPrice: 6800,
      launchScore: 88,
      createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    },
    {
      id: "biz_demo_4",
      name: "Nexus Office",
      country: "Germany",
      category: "Office",
      status: "live",
      orders: 350,
      currentSellingPrice: 5100,
      launchScore: 79,
      createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
    },
    {
      id: "biz_demo_5",
      name: "SwiftPet Co",
      country: "UAE",
      category: "Pet",
      status: "pending",
      orders: 40,
      currentSellingPrice: 2800,
      launchScore: 75,
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
  ];
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const businesses = demoBusinesses();
  const result = simulateOrders(businesses, { days: opts.days, seed: opts.seed });

  if (opts.json) {
    console.log(JSON.stringify(result.summary, null, 2));
  } else {
    console.log("\n╔══════════════════════════════════════════════╗");
    console.log("║     CREST Order Algo — Simulation Report     ║");
    console.log("╚══════════════════════════════════════════════╝\n");
    console.log(`  Days:        ${result.summary.days}`);
    console.log(`  Seed:        ${opts.seed}`);
    console.log(`  Businesses:  ${result.summary.businesses}`);
    console.log(`  Orders:      ${result.summary.totalOrders.toLocaleString()}`);
    console.log(`  Revenue:     ₹${result.summary.totalRevenue.toLocaleString()}`);
    console.log(`  Holiday hits:${result.summary.holidayHits}`);
    console.log("\n── Per business ─────────────────────────────");
    for (const b of businesses) {
      const s = result.byBusiness[b.id];
      console.log(
        `  ${b.name.padEnd(22)} ${String(s.orderCount).padStart(5)} orders  ₹${s.revenue.toLocaleString().padStart(10)}  (${b.category} · ${b.country} · ${b.status})`
      );
    }

    console.log("\n── Sample day factors (first business, last 7 days) ──");
    const end = new Date();
    end.setHours(12, 0, 0, 0);
    for (let d = 6; d >= 0; d--) {
      const day = new Date(end);
      day.setDate(end.getDate() - d);
      const { expected, factors, holiday } = expectedOrdersForDay(businesses[0], day);
      const hol = getHoliday(day, businesses[0].country);
      const label = day.toISOString().slice(0, 10);
      const dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day.getDay()];
      console.log(
        `  ${label} ${dow}  λ=${expected.toFixed(2).padStart(5)}  wk=${factors.weekday.toFixed(2)}  hol=${(hol?.boost ?? 1).toFixed(2)}${holiday ? ` (${holiday})` : ""}`
      );
    }

    console.log("\n── Daily totals (peak days) ─────────────────");
    const peaks = [...result.dailyTotals].sort((a, b) => b.orders - a.orders).slice(0, 5);
    for (const row of peaks) {
      console.log(
        `  ${row.date}  ${String(row.orders).padStart(4)} orders${row.holidayHits ? `  ★ ${row.holidayHits} holiday market(s)` : ""}`
      );
    }
    console.log("");
  }

  const outDir = join(__dirname, "output");
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, `orders-seed-${opts.seed}-days-${opts.days}.json`);
  writeFileSync(
    outPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        options: opts,
        summary: result.summary,
        byBusiness: result.byBusiness,
        dailyTotals: result.dailyTotals,
        sampleOrders: result.orders.slice(0, 20),
      },
      null,
      2
    )
  );
  console.log(`Wrote sample output → ${outPath}\n`);
}

main();
