/**
 * Tool executor for MCP server.
 * Routes tool execution to appropriate handlers using a single O(1) registry lookup.
 */

import axios, { AxiosInstance } from "axios";
import { CallToolRequestSchema, ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { jiraToolRegistry } from "../jira/index.js";
import { confluenceToolRegistry } from "../confluence/index.js";
import { ToolHandler } from "../types/tools.js";

/** Combined registry for O(1) tool dispatch without string matching. */
const toolRegistry: Record<string, ToolHandler> = {
  ...jiraToolRegistry,
  ...confluenceToolRegistry,
};

/**
 * Register tool executor handler with the MCP server.
 *
 * @param server - MCP server instance
 * @param apiClient - Atlassian API client
 */
export function registerToolExecutor(server: Server, apiClient: AxiosInstance): void {
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      const toolName = request.params.name;
      const toolArgs = request.params.arguments || {};

      const handler = toolRegistry[toolName];
      if (!handler) {
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${toolName}`);
      }

      return await handler(toolArgs, apiClient);
    } catch (error) {
      console.error("Error executing tool:", error);
      if (axios.isAxiosError(error)) {
        return {
          content: [{
            type: "text",
            text: `Atlassian API error: ${error.response?.data?.message || error.message}`
          }],
          isError: true
        };
      }
      throw error;
    }
  });
}

