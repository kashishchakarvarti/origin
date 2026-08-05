#!/usr/bin/env node
/**
 * Production server — only works after npm run build.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";

const NEXT_DIR = ".next";

if (!fs.existsSync(`${NEXT_DIR}/BUILD_ID`)) {
  console.error("[crest] No production build found. Run: npm run build");
  process.exit(1);
}

const child = spawn("npx", ["next", "start", "-p", String(process.env.PORT || 3000)], {
  stdio: "inherit",
  shell: process.platform === "win32",
});

child.on("exit", (code) => process.exit(code ?? 0));
