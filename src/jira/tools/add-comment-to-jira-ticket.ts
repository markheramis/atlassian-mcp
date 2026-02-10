/**
 * Add comment to JIRA ticket tool implementation.
 * Adds a comment to an existing JIRA ticket.
 */

import { AxiosInstance } from "axios";
import { createAdfDocument } from "../../utils/adf.js";
import { createTextResponse } from "../../utils/response.js";
import { requireString } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Add a comment to a JIRA ticket.
 *
 * @param toolArgs - Tool arguments containing ticket_key and comment
 * @param apiClient - Atlassian API client
 * @returns Tool execution result confirming comment addition
 */
export async function addCommentToJiraTicket(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const ticketKey = requireString(toolArgs?.ticket_key, "ticket_key");
  const comment = requireString(toolArgs?.comment, "comment");
  await apiClient.post(`/rest/api/3/issue/${ticketKey}/comment`, {
    body: createAdfDocument(comment),
  });
  return createTextResponse(`Added comment to ${ticketKey}`);
}

