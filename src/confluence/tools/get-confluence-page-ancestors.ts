/**
 * Get Confluence page ancestors tool implementation.
 * Gets parent pages.
 */

import { AxiosInstance } from "axios";
import { createSuccessResponse } from "../../utils/response.js";
import { requireString } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Get parent pages (ancestors) of a Confluence page.
 *
 * @param toolArgs - Tool arguments containing page_id
 * @param apiClient - Atlassian API client
 * @returns Tool execution result with ancestors list
 */
export async function getConfluencePageAncestors(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const pageId = requireString(toolArgs?.page_id, "page_id");
  const response = await apiClient.get(`/wiki/rest/api/content/${pageId}`, {
    params: { expand: "ancestors" },
  });
  const data = {
    id: response.data.id,
    title: response.data.title,
    ancestors: response.data.ancestors ?? [],
  };
  return createSuccessResponse(data);
}

