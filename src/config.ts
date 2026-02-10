/**
 * Configuration management for Atlassian MCP server.
 * Handles loading configuration from file or environment variables using async operations.
 */

import { readFile, access, constants } from "fs/promises";
import path from "path";

export interface Config {
  atlassian: {
    baseUrl: string;
    email: string;
    token: string;
  };
  server: {
    name: string;
    version: string;
  };
}

/**
 * Load configuration from file or environment variables.
 *
 * @returns Configuration object
 * @throws Error if required configuration is missing
 */
export async function loadConfig(): Promise<Config> {
  const configPath = process.env.ATLASSIAN_CONFIG_PATH || path.join(process.cwd(), "config", "config.json");
  let config: Config;

  try {
    // Check if config file exists using async operation
    await access(configPath, constants.R_OK);
    console.error(`Loading config from ${configPath}`);
    const configData = await readFile(configPath, "utf8");
    config = JSON.parse(configData);
  } catch {
    // Fallback to environment variables
    console.error(`Config file not found at ${configPath}, using environment variables`);
    config = {
      atlassian: {
        baseUrl: process.env.ATLASSIAN_BASE_URL || "",
        email: process.env.ATLASSIAN_EMAIL || "",
        token: process.env.ATLASSIAN_TOKEN || "",
      },
      server: {
        name: process.env.SERVER_NAME || "atlassian-server",
        version: process.env.SERVER_VERSION || "0.1.0",
      },
    };
  }

  // Validate required configuration
  if (!config.atlassian.baseUrl) {
    throw new Error("Atlassian base URL is required in config or ATLASSIAN_BASE_URL environment variable");
  }

  if (!config.atlassian.email) {
    throw new Error("Atlassian email is required in config or ATLASSIAN_EMAIL environment variable");
  }

  if (!config.atlassian.token) {
    throw new Error("Atlassian token is required in config or ATLASSIAN_TOKEN environment variable");
  }

  return config;
}
