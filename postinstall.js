#!/usr/bin/env node

/**
 * Post-installation script for Atlassian MCP Server.
 * Checks if configuration exists; if not, runs the setup script and waits for it to finish.
 */

import { access, constants } from "fs/promises";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.join(__dirname, "config", "config.json");
const installScriptPath = path.join(__dirname, "install.js");

try {
  await access(configPath, constants.F_OK);
  console.log("Config exists, skipping setup");
} catch {
  console.log("Running setup...");
  const result = spawnSync(process.execPath, [installScriptPath], {
    stdio: "inherit",
    cwd: __dirname,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
