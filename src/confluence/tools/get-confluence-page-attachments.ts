/**
 * Get Confluence page attachments tool implementation.
 * Lists all attachments on a page.
 */

import { AxiosInstance } from "axios";
import { createSuccessResponse } from "../../utils/response.js";
import { requireString } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Get all attachments on a Confluence page.
 *
 * @param toolArgs - Tool arguments containing page_id
 * @param apiClient - Atlassian API client
 * @returns Tool execution result with attachments list
 */
export async function getConfluencePageAttachments(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const pageId = requireString(toolArgs?.page_id, "page_id");
  const response = await apiClient.get(`/wiki/rest/api/content/${pageId}/child/attachment`, {
    params: { expand: "version,container" },
  });
  return createSuccessResponse(response.data);
}

