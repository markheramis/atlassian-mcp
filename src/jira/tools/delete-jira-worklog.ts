/**
 * Delete JIRA worklog tool implementation.
 * Removes worklog entries from JIRA tickets.
 */

import { AxiosInstance } from "axios";
import { createTextResponse } from "../../utils/response.js";
import { requireString } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Delete a worklog entry from a JIRA ticket.
 *
 * @param toolArgs - Tool arguments containing ticket_key and worklog_id
 * @param apiClient - Atlassian API client
 * @returns Tool execution result confirming deletion
 */
export async function deleteJiraWorklog(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const ticketKey = requireString(toolArgs?.ticket_key, "ticket_key");
  const worklogId = requireString(toolArgs?.worklog_id, "worklog_id");
  await apiClient.delete(`/rest/api/3/issue/${ticketKey}/worklog/${worklogId}`);
  return createTextResponse(`Deleted worklog ${worklogId} from JIRA ticket: ${ticketKey}`);
}

