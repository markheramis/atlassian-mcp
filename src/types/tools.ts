/**
 * Shared type definitions for MCP tools.
 * Provides consistent typing across all Jira and Confluence tools.
 */

import { AxiosInstance } from "axios";

/**
 * Standard response structure for tool execution results.
 * Uses index signature to allow additional properties required by MCP SDK.
 */
export interface ToolResponse {
  [x: string]: unknown;
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
}

/**
 * Function signature for tool handlers.
 */
export type ToolHandler = (
  args: Record<string, unknown>,
  apiClient: AxiosInstance
) => Promise<ToolResponse>;

/**
 * Registry mapping tool names to their handler functions.
 */
export type ToolRegistry = Record<string, ToolHandler>;
