/**
 * Remove label from JIRA ticket tool implementation.
 * Removes labels from tickets.
 */

import { AxiosInstance } from "axios";
import { createTextResponse } from "../../utils/response.js";
import { requireString } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Remove a label from a JIRA ticket.
 *
 * @param toolArgs - Tool arguments containing ticket_key and label
 * @param apiClient - Atlassian API client
 * @returns Tool execution result confirming label removal
 */
export async function removeLabelFromJiraTicket(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const ticketKey = requireString(toolArgs?.ticket_key, "ticket_key");
  const label = requireString(toolArgs?.label, "label");
  await apiClient.put(`/rest/api/3/issue/${ticketKey}`, {
    update: { labels: [{ remove: label }] },
  });
  return createTextResponse(`Removed label "${label}" from JIRA ticket: ${ticketKey}`);
}

