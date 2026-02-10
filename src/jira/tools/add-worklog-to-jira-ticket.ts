/**
 * Add worklog to JIRA ticket tool implementation.
 * Logs time spent on JIRA tickets.
 */

import { AxiosInstance } from "axios";
import { createAdfDocument } from "../../utils/adf.js";
import { createSuccessResponse } from "../../utils/response.js";
import { requireString, optionalString } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Add a worklog entry to a JIRA ticket.
 *
 * @param toolArgs - Tool arguments containing ticket_key, time_spent, started, and optional comment
 * @param apiClient - Atlassian API client
 * @returns Tool execution result with worklog details
 */
export async function addWorklogToJiraTicket(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const ticketKey = requireString(toolArgs?.ticket_key, "ticket_key");
  const timeSpent = requireString(toolArgs?.time_spent, "time_spent");
  const started = requireString(toolArgs?.started, "started");
  const comment = optionalString(toolArgs?.comment);

  const worklogPayload: Record<string, unknown> = { timeSpent, started };
  if (comment) {
    worklogPayload.comment = createAdfDocument(comment);
  }

  const response = await apiClient.post(`/rest/api/3/issue/${ticketKey}/worklog`, worklogPayload);
  return createSuccessResponse({
    id: response.data.id,
    ticket_key: ticketKey,
    timeSpent: response.data.timeSpent,
    timeSpentSeconds: response.data.timeSpentSeconds,
    started: response.data.started,
    comment: response.data.comment,
    author: response.data.author,
  });
}

