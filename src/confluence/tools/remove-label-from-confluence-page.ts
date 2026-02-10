/**
 * Remove label from Confluence page tool implementation.
 * Removes labels from pages.
 */

import { AxiosInstance } from "axios";
import { createTextResponse } from "../../utils/response.js";
import { requireString } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Remove a label from a Confluence page.
 *
 * @param toolArgs - Tool arguments containing page_id and label
 * @param apiClient - Atlassian API client
 * @returns Tool execution result confirming label removal
 */
export async function removeLabelFromConfluencePage(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const pageId = requireString(toolArgs?.page_id, "page_id");
  const label = requireString(toolArgs?.label, "label");
  const encodedLabel = encodeURIComponent(label);
  await apiClient.delete(`/wiki/rest/api/content/${pageId}/label/${encodedLabel}`);
  return createTextResponse(`Removed label "${label}" from Confluence page: ${pageId}`);
}

