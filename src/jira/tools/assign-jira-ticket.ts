/**
 * Assign JIRA ticket tool implementation.
 * Assigns a JIRA ticket to a user.
 */

import { AxiosInstance } from "axios";
import { resolveUserToAccountId } from "../../utils/user-lookup.js";
import { createTextResponse } from "../../utils/response.js";
import { requireString } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Assign a JIRA ticket to a user.
 *
 * @param toolArgs - Tool arguments containing ticket_key and assignee (accountId or email)
 * @param apiClient - Atlassian API client
 * @returns Tool execution result confirming the assignment
 */
export async function assignJiraTicket(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const ticketKey = requireString(toolArgs?.ticket_key, "ticket_key");
  const assignee = requireString(toolArgs?.assignee, "assignee");

  if (assignee === "-1" || assignee.toLowerCase() === "unassign") {
    await apiClient.put(`/rest/api/3/issue/${ticketKey}/assignee`, null);
    return createTextResponse(`Unassigned JIRA ticket ${ticketKey}`);
  }

  const accountId = await resolveUserToAccountId(apiClient, assignee);
  await apiClient.put(`/rest/api/3/issue/${ticketKey}/assignee`, { accountId });
  return createTextResponse(`Assigned JIRA ticket ${ticketKey}`);
}

