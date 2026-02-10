/**
 * Add watcher to JIRA ticket tool implementation.
 * Adds users as watchers to receive ticket updates.
 */

import { AxiosInstance } from "axios";
import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import { createTextResponse } from "../../utils/response.js";
import { requireString, optionalString } from "../../utils/validation.js";
import { lookupUserByEmail } from "../../utils/user-lookup.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Add a user as a watcher to a JIRA ticket.
 *
 * @param toolArgs - Tool arguments containing ticket_key and account_id (or email for lookup)
 * @param apiClient - Atlassian API client
 * @returns Tool execution result confirming watcher addition
 */
export async function addWatcherToJiraTicket(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const ticketKey = requireString(toolArgs?.ticket_key, "ticket_key");
  const accountId = optionalString(toolArgs?.account_id);
  const email = optionalString(toolArgs?.email);

  if (!accountId && !email) {
    throw new McpError(ErrorCode.InvalidParams, "Either account_id or email is required");
  }

  const finalAccountId = accountId ?? (email ? await lookupUserByEmail(apiClient, email) : undefined);
  await apiClient.post(`/rest/api/3/issue/${ticketKey}/watchers`, JSON.stringify(finalAccountId));
  return createTextResponse(`Added watcher (accountId: ${finalAccountId}) to JIRA ticket: ${ticketKey}`);
}

