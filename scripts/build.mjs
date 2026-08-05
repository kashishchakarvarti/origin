#!/usr/bin/env node
/**
 * Stable production build.
 * Stops dev server and clears cache before building
 * so build never corrupts a running dev session.
 */
import { spawn, execSync } from "node:child_process";
import fs from "node:fs";

const PORT = Number(process.env.PORT || 3000);
const NEXT_DIR = ".next";

function killPort(port) {
  try {
    execSync(`lsof -ti:${port} | xargs kill -9 2>/dev/null`, { stdio: "ignore" });
  } catch {
    // No process on port
  }
}

async function main() {
  // Stop dev server if running — shared .next causes internal server errors
  killPort(PORT);
  await new Promise((r) => setTimeout(r, 500));

  if (fs.existsSync(NEXT_DIR)) {
    fs.rmSync(NEXT_DIR, { recursive: true, force: true });
    console.log("[crest] Cleared .next before build");
  }

  const child = spawn("npx", ["next", "build"], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  child.on("exit", (code) => process.exit(code ?? 0));
}

main().catch((err) => {
  console.error("[crest] Build failed:", err);
  process.exit(1);
});
