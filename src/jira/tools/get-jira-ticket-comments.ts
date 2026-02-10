/**
 * Get JIRA ticket comments tool implementation.
 * Retrieves all comments on a JIRA ticket.
 */

import { AxiosInstance } from "axios";
import { createSuccessResponse } from "../../utils/response.js";
import { requireString } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Get all comments on a JIRA ticket.
 *
 * @param toolArgs - Tool arguments containing ticket_key
 * @param apiClient - Atlassian API client
 * @returns Tool execution result with all comments
 */
export async function getJiraTicketComments(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const ticketKey = requireString(toolArgs?.ticket_key, "ticket_key");
  const response = await apiClient.get(`/rest/api/3/issue/${ticketKey}/comment`);
  return createSuccessResponse(response.data);
}

