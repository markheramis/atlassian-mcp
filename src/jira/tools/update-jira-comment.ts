/**
 * Update JIRA comment tool implementation.
 * Edits existing comments on JIRA tickets.
 */

import { AxiosInstance } from "axios";
import { createAdfDocument } from "../../utils/adf.js";
import { createTextResponse } from "../../utils/response.js";
import { requireString } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Update an existing comment on a JIRA ticket.
 *
 * @param toolArgs - Tool arguments containing ticket_key, comment_id, and comment text
 * @param apiClient - Atlassian API client
 * @returns Tool execution result confirming the update
 */
export async function updateJiraComment(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const ticketKey = requireString(toolArgs?.ticket_key, "ticket_key");
  const commentId = requireString(toolArgs?.comment_id, "comment_id");
  const comment = requireString(toolArgs?.comment, "comment");
  await apiClient.put(`/rest/api/3/issue/${ticketKey}/comment/${commentId}`, {
    body: createAdfDocument(comment),
  });
  return createTextResponse(`Updated comment ${commentId} on JIRA ticket: ${ticketKey}`);
}

