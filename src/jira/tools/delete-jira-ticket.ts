/**
 * Delete JIRA ticket tool implementation.
 * Deletes a JIRA ticket (if permissions allow).
 */

import { AxiosInstance } from "axios";
import { createTextResponse } from "../../utils/response.js";
import { requireString, booleanWithDefault } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Delete a JIRA ticket.
 *
 * @param toolArgs - Tool arguments containing ticket_key and optional delete_subtasks
 * @param apiClient - Atlassian API client
 * @returns Tool execution result confirming deletion
 */
export async function deleteJiraTicket(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const ticketKey = requireString(toolArgs?.ticket_key, "ticket_key");
  const deleteSubtasks = booleanWithDefault(toolArgs?.delete_subtasks, false);
  await apiClient.delete(`/rest/api/3/issue/${ticketKey}`, {
    params: { deleteSubtasks },
  });
  return createTextResponse(`Deleted JIRA ticket: ${ticketKey}`);
}

