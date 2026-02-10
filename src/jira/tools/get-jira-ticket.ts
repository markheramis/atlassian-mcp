/**
 * Get JIRA ticket tool implementation.
 * Retrieves details of a JIRA ticket by key.
 */

import { AxiosInstance } from "axios";
import { createSuccessResponse } from "../../utils/response.js";
import { requireString } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Get details of a JIRA ticket by key.
 *
 * @param toolArgs - Tool arguments containing ticket_key
 * @param apiClient - Atlassian API client
 * @returns Tool execution result with ticket details
 */
export async function getJiraTicket(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const ticketKey = requireString(toolArgs?.ticket_key, "ticket_key");

  const response = await apiClient.get(`/rest/api/3/issue/${ticketKey}`, {
    params: {
      fields: "summary,description,status,created,updated,assignee,reporter,priority,issuetype",
    },
  });

  return createSuccessResponse(response.data);
}

