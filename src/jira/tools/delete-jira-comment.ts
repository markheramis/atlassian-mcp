/**
 * Delete JIRA comment tool implementation.
 * Removes comments from JIRA tickets.
 */

import { AxiosInstance } from "axios";
import { createTextResponse } from "../../utils/response.js";
import { requireString } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Delete a comment from a JIRA ticket.
 *
 * @param toolArgs - Tool arguments containing ticket_key and comment_id
 * @param apiClient - Atlassian API client
 * @returns Tool execution result confirming deletion
 */
export async function deleteJiraComment(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const ticketKey = requireString(toolArgs?.ticket_key, "ticket_key");
  const commentId = requireString(toolArgs?.comment_id, "comment_id");
  await apiClient.delete(`/rest/api/3/issue/${ticketKey}/comment/${commentId}`);
  return createTextResponse(`Deleted comment ${commentId} from JIRA ticket: ${ticketKey}`);
}

