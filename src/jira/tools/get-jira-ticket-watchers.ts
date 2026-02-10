/**
 * Get JIRA ticket watchers tool implementation.
 * Lists all watchers of a JIRA ticket.
 */

import { AxiosInstance } from "axios";
import { createSuccessResponse } from "../../utils/response.js";
import { requireString } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Get all watchers of a JIRA ticket.
 *
 * @param toolArgs - Tool arguments containing ticket_key
 * @param apiClient - Atlassian API client
 * @returns Tool execution result with list of watchers
 */
export async function getJiraTicketWatchers(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const ticketKey = requireString(toolArgs?.ticket_key, "ticket_key");
  const response = await apiClient.get(`/rest/api/3/issue/${ticketKey}/watchers`);
  return createSuccessResponse(response.data);
}

