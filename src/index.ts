#!/usr/bin/env node

/**
 * Atlassian MCP server for JIRA and Confluence integration.
 * This server provides tools to interact with JIRA tickets and Confluence pages.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "./config.js";
import { createApiClient } from "./api-client.js";
import { registerResourceHandlers } from "./handlers/resources.js";
import { registerToolDefinitions } from "./handlers/tools.js";
import { registerToolExecutor } from "./handlers/tool-executor.js";

/**
 * Main entry point for the Atlassian MCP server.
 */
async function main() {
  // Load configuration asynchronously
  const config = await loadConfig();

  // Create API client
  const apiClient = createApiClient(config);

  // Create MCP server
  const server = new Server(
    {
      name: config.server.name,
      version: config.server.version,
    },
    {
      capabilities: {
        resources: {},
        tools: {},
      },
    }
  );

  // Register handlers
  registerResourceHandlers(server, apiClient);
  registerToolDefinitions(server);
  registerToolExecutor(server, apiClient);

  // Start the server
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`Atlassian MCP server running on stdio (connected to ${config.atlassian.baseUrl})`);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
