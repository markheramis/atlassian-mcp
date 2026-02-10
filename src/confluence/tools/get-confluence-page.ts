/**
 * Get Confluence page tool implementation.
 * Retrieves a Confluence page by ID.
 */

import { AxiosInstance } from "axios";
import { createSuccessResponse } from "../../utils/response.js";
import { requireString } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Get a Confluence page by ID.
 *
 * @param toolArgs - Tool arguments containing page_id
 * @param apiClient - Atlassian API client
 * @returns Tool execution result with page details
 */
export async function getConfluencePage(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const pageId = requireString(toolArgs?.page_id, "page_id");
  const response = await apiClient.get(`/wiki/rest/api/content/${pageId}`, {
    params: { expand: "body.storage,version,space" },
  });
  return createSuccessResponse(response.data);
}

