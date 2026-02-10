/**
 * Delete Confluence comment tool implementation.
 * Removes comments from pages.
 */

import { AxiosInstance } from "axios";
import { createTextResponse } from "../../utils/response.js";
import { requireString } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Delete a comment from a Confluence page.
 *
 * @param toolArgs - Tool arguments containing comment_id
 * @param apiClient - Atlassian API client
 * @returns Tool execution result confirming deletion
 */
export async function deleteConfluenceComment(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const commentId = requireString(toolArgs?.comment_id, "comment_id");
  await apiClient.delete(`/wiki/rest/api/content/${commentId}`);
  return createTextResponse(`Deleted Confluence comment: ${commentId}`);
}

