/**
 * Get Confluence page history tool implementation.
 * Gets version history of a page.
 */

import { AxiosInstance } from "axios";
import { createSuccessResponse } from "../../utils/response.js";
import { requireString } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Get version history of a Confluence page.
 *
 * @param toolArgs - Tool arguments containing page_id
 * @param apiClient - Atlassian API client
 * @returns Tool execution result with page history
 */
export async function getConfluencePageHistory(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const pageId = requireString(toolArgs?.page_id, "page_id");
  const response = await apiClient.get(`/wiki/rest/api/content/${pageId}`, {
    params: { expand: "history,version" },
  });
  const data = {
    id: response.data.id,
    title: response.data.title,
    current_version: response.data.version,
    history: response.data.history,
  };
  return createSuccessResponse(data);
}

