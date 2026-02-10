/**
 * Add label to Confluence page tool implementation.
 * Adds labels to pages for categorization.
 */

import { AxiosInstance } from "axios";
import { createSuccessResponse } from "../../utils/response.js";
import { requireString } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Add a label to a Confluence page.
 *
 * @param toolArgs - Tool arguments containing page_id and label
 * @param apiClient - Atlassian API client
 * @returns Tool execution result confirming label addition
 */
export async function addLabelToConfluencePage(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const pageId = requireString(toolArgs?.page_id, "page_id");
  const label = requireString(toolArgs?.label, "label");
  await apiClient.post(`/wiki/rest/api/content/${pageId}/label`, [
    { prefix: "global", name: label },
  ]);
  return createSuccessResponse({ page_id: pageId, label, added: true });
}

