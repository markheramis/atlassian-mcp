/**
 * Update JIRA ticket tool implementation.
 * Updates fields of an existing JIRA ticket.
 */

import { AxiosInstance } from "axios";
import { createAdfDocument } from "../../utils/adf.js";
import { createTextResponse } from "../../utils/response.js";
import { requireString } from "../../utils/validation.js";
import { requireAtLeastOneField, optionalArray } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Update a JIRA ticket's fields.
 *
 * @param toolArgs - Tool arguments containing ticket_key and optional fields to update
 * @param apiClient - Atlassian API client
 * @returns Tool execution result confirming the update
 */
export async function updateJiraTicket(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const ticketKey = requireString(toolArgs?.ticket_key, "ticket_key");
  requireAtLeastOneField(toolArgs ?? {}, ["summary", "description", "priority", "labels"]);

  const fields: Record<string, unknown> = {};

  if (toolArgs?.summary !== undefined) {
    fields.summary = String(toolArgs.summary);
  }
  if (toolArgs?.description !== undefined) {
    fields.description = createAdfDocument(String(toolArgs.description));
  }
  if (toolArgs?.priority !== undefined) {
    fields.priority = { name: String(toolArgs.priority) };
  }
  const labels = optionalArray(toolArgs?.labels);
  if (labels !== undefined) {
    fields.labels = labels;
  }

  await apiClient.put(`/rest/api/3/issue/${ticketKey}`, { fields });
  return createTextResponse(`Updated JIRA ticket: ${ticketKey}`);
}

