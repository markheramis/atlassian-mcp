/**
 * Response builder utilities for MCP tools.
 * Provides standardized response formatting across all tools.
 */

import { ToolResponse } from "../types/tools.js";

/**
 * Create a success response with formatted data.
 * Handles both string and object data types.
 *
 * @param data - The data to include in the response
 * @returns Formatted tool response
 */
export function createSuccessResponse(data: unknown): ToolResponse {
  return {
    content: [{
      type: "text",
      text: typeof data === "string" ? data : JSON.stringify(data, null, 2)
    }]
  } as ToolResponse;
}

/**
 * Create an error response with a message.
 *
 * @param message - The error message
 * @returns Formatted error response
 */
export function createErrorResponse(message: string): ToolResponse {
  return {
    content: [{ type: "text", text: message }],
    isError: true
  } as ToolResponse;
}

/**
 * Create a simple text response.
 *
 * @param text - The text message
 * @returns Formatted tool response
 */
export function createTextResponse(text: string): ToolResponse {
  return {
    content: [{ type: "text", text }]
  } as ToolResponse;
}
