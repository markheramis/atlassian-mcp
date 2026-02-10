/**
 * Update JIRA worklog tool implementation.
 * Modifies existing worklog entries.
 */

import { AxiosInstance } from "axios";
import { createAdfDocument } from "../../utils/adf.js";
import { createTextResponse } from "../../utils/response.js";
import { requireString, optionalString } from "../../utils/validation.js";
import { requireAtLeastOneField } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Update an existing worklog entry on a JIRA ticket.
 *
 * @param toolArgs - Tool arguments containing ticket_key, worklog_id, and optional time_spent, started, comment
 * @param apiClient - Atlassian API client
 * @returns Tool execution result confirming the update
 */
export async function updateJiraWorklog(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const ticketKey = requireString(toolArgs?.ticket_key, "ticket_key");
  const worklogId = requireString(toolArgs?.worklog_id, "worklog_id");
  requireAtLeastOneField(toolArgs ?? {}, ["time_spent", "started", "comment"]);

  const timeSpent = optionalString(toolArgs?.time_spent);
  const started = optionalString(toolArgs?.started);
  const comment = optionalString(toolArgs?.comment);

  const updatePayload: Record<string, unknown> = {};
  if (timeSpent !== undefined) updatePayload.timeSpent = timeSpent;
  if (started !== undefined) updatePayload.started = started;
  if (comment !== undefined) updatePayload.comment = createAdfDocument(comment);

  await apiClient.put(`/rest/api/3/issue/${ticketKey}/worklog/${worklogId}`, updatePayload);
  return createTextResponse(`Updated worklog ${worklogId} on JIRA ticket: ${ticketKey}`);
}

