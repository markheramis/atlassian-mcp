/**
 * Delete Confluence page tool implementation.
 * Deletes Confluence pages.
 */

import { AxiosInstance } from "axios";
import { createTextResponse } from "../../utils/response.js";
import { requireString } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Delete a Confluence page.
 *
 * @param toolArgs - Tool arguments containing page_id
 * @param apiClient - Atlassian API client
 * @returns Tool execution result confirming deletion
 */
export async function deleteConfluencePage(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const pageId = requireString(toolArgs?.page_id, "page_id");
  await apiClient.delete(`/wiki/rest/api/content/${pageId}`);
  return createTextResponse(`Deleted Confluence page: ${pageId}`);
}

