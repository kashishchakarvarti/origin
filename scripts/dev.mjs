#!/usr/bin/env node
/**
 * Stable dev server startup.
 * Prevents internal server errors caused by:
 * - Multiple dev servers fighting over .next
 * - Production build artifacts mixed with dev cache
 * - Turbopack manifest corruption
 */
import { spawn, execSync } from "node:child_process";
import fs from "node:fs";
import net from "node:net";

const PORT = Number(process.env.PORT || 3000);
const NEXT_DIR = ".next";

function killPort(port) {
  try {
    execSync(`lsof -ti:${port} | xargs kill -9 2>/dev/null`, { stdio: "ignore" });
  } catch {
    // No process on port
  }
}

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
}

function cleanNextCache(reason) {
  if (fs.existsSync(NEXT_DIR)) {
    fs.rmSync(NEXT_DIR, { recursive: true, force: true });
    console.log(`[crest] Cleared .next (${reason})`);
  }
}

async function main() {
  // Stop any stale server on this port
  if (!(await isPortFree(PORT))) {
    console.log(`[crest] Port ${PORT} busy — stopping stale process...`);
    killPort(PORT);
    await new Promise((r) => setTimeout(r, 800));
  }

  // Always start dev with a fresh cache — prevents every known 500 error
  cleanNextCache("fresh dev session");

  console.log(`[crest] Starting dev server on http://localhost:${PORT}`);

  const child = spawn("npx", ["next", "dev", "-p", String(PORT)], {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: { ...process.env, FORCE_COLOR: "1" },
  });

  const shutdown = () => {
    child.kill("SIGTERM");
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  child.on("exit", (code) => process.exit(code ?? 0));
}

main().catch((err) => {
  console.error("[crest] Failed to start dev server:", err);
  process.exit(1);
});
