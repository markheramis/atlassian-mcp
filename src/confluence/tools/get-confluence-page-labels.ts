/**
 * Get Confluence page labels tool implementation.
 * Gets all labels on a page.
 */

import { AxiosInstance } from "axios";
import { createSuccessResponse } from "../../utils/response.js";
import { requireString } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Get all labels on a Confluence page.
 *
 * @param toolArgs - Tool arguments containing page_id
 * @param apiClient - Atlassian API client
 * @returns Tool execution result with labels list
 */
export async function getConfluencePageLabels(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const pageId = requireString(toolArgs?.page_id, "page_id");
  const response = await apiClient.get(`/wiki/rest/api/content/${pageId}/label`);
  return createSuccessResponse(response.data);
}

