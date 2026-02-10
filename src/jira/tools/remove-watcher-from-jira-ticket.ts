/**
 * Remove watcher from JIRA ticket tool implementation.
 * Removes watchers from tickets.
 */

import { AxiosInstance } from "axios";
import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import { createTextResponse } from "../../utils/response.js";
import { requireString, optionalString } from "../../utils/validation.js";
import { lookupUserByUsername } from "../../utils/user-lookup.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Remove a watcher from a JIRA ticket.
 *
 * @param toolArgs - Tool arguments containing ticket_key and username (or account_id)
 * @param apiClient - Atlassian API client
 * @returns Tool execution result confirming watcher removal
 */
export async function removeWatcherFromJiraTicket(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const ticketKey = requireString(toolArgs?.ticket_key, "ticket_key");
  const username = optionalString(toolArgs?.username);
  const accountId = optionalString(toolArgs?.account_id);

  if (!username && !accountId) {
    throw new McpError(ErrorCode.InvalidParams, "Either username or account_id is required");
  }

  const finalAccountId = accountId ?? (username ? await lookupUserByUsername(apiClient, username) : undefined);
  await apiClient.delete(`/rest/api/3/issue/${ticketKey}/watchers`, {
    params: { accountId: finalAccountId },
  });
  return createTextResponse(`Removed watcher (accountId: ${finalAccountId}) from JIRA ticket: ${ticketKey}`);
}

