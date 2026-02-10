/**
 * Add label to JIRA ticket tool implementation.
 * Adds labels to tickets for categorization.
 */

import { AxiosInstance } from "axios";
import { createTextResponse } from "../../utils/response.js";
import { requireString } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Add a label to a JIRA ticket.
 *
 * @param toolArgs - Tool arguments containing ticket_key and label
 * @param apiClient - Atlassian API client
 * @returns Tool execution result confirming label addition
 */
export async function addLabelToJiraTicket(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const ticketKey = requireString(toolArgs?.ticket_key, "ticket_key");
  const label = requireString(toolArgs?.label, "label");
  await apiClient.put(`/rest/api/3/issue/${ticketKey}`, {
    update: { labels: [{ add: label }] },
  });
  return createTextResponse(`Added label "${label}" to JIRA ticket: ${ticketKey}`);
}

