/**
 * Get JIRA ticket transitions tool implementation.
 * Retrieves available status transitions for a JIRA ticket.
 */

import { AxiosInstance } from "axios";
import { createSuccessResponse } from "../../utils/response.js";
import { requireString } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Get available transitions for a JIRA ticket.
 *
 * @param toolArgs - Tool arguments containing ticket_key
 * @param apiClient - Atlassian API client
 * @returns Tool execution result with available transitions
 */
export async function getJiraTicketTransitions(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const ticketKey = requireString(toolArgs?.ticket_key, "ticket_key");
  const response = await apiClient.get(`/rest/api/3/issue/${ticketKey}/transitions`);
  return createSuccessResponse(response.data);
}

