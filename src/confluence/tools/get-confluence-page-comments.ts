/**
 * Get Confluence page comments tool implementation.
 * Retrieves all comments on a Confluence page.
 */

import { AxiosInstance } from "axios";
import { createSuccessResponse } from "../../utils/response.js";
import { requireString } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Get all comments on a Confluence page.
 *
 * @param toolArgs - Tool arguments containing page_id
 * @param apiClient - Atlassian API client
 * @returns Tool execution result with all comments
 */
export async function getConfluencePageComments(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const pageId = requireString(toolArgs?.page_id, "page_id");
  const response = await apiClient.get(`/wiki/rest/api/content/${pageId}/child/comment`, {
    params: { expand: "body.storage,version" },
  });
  return createSuccessResponse(response.data);
}

