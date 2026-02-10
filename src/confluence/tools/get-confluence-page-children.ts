/**
 * Get Confluence page children tool implementation.
 * Gets child pages (sub-pages).
 */

import { AxiosInstance } from "axios";
import { createSuccessResponse } from "../../utils/response.js";
import { requireString, numberWithDefault } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Get child pages (sub-pages) of a Confluence page.
 *
 * @param toolArgs - Tool arguments containing page_id and optional limit
 * @param apiClient - Atlassian API client
 * @returns Tool execution result with child pages list
 */
export async function getConfluencePageChildren(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const pageId = requireString(toolArgs?.page_id, "page_id");
  const limit = numberWithDefault(toolArgs?.limit, 25);
  const response = await apiClient.get(`/wiki/rest/api/content/${pageId}/child/page`, {
    params: { limit, expand: "space,version" },
  });
  return createSuccessResponse(response.data);
}

