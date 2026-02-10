/**
 * Transition JIRA ticket tool implementation.
 * Changes the status of a JIRA ticket through workflow transitions.
 */

import { AxiosInstance } from "axios";
import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import { createTextResponse } from "../../utils/response.js";
import { requireString, optionalString } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

interface TransitionItem {
  id: string;
  name: string;
}

/**
 * Transition a JIRA ticket to a new status.
 *
 * @param toolArgs - Tool arguments containing ticket_key and transition_id or transition_name
 * @param apiClient - Atlassian API client
 * @returns Tool execution result confirming the transition
 */
export async function transitionJiraTicket(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const ticketKey = requireString(toolArgs?.ticket_key, "ticket_key");
  const transitionIdArg = optionalString(toolArgs?.transition_id);
  const transitionNameArg = optionalString(toolArgs?.transition_name);

  let transitionId: string;

  if (transitionIdArg) {
    transitionId = transitionIdArg;
  } else if (transitionNameArg) {
    const transitionsResponse = await apiClient.get(`/rest/api/3/issue/${ticketKey}/transitions`);
    const availableTransitions: TransitionItem[] = transitionsResponse.data.transitions ?? [];
    const transition = availableTransitions.find(
      (t) => t.name.toLowerCase() === transitionNameArg.toLowerCase()
    );
    if (!transition) {
      const availableNames = availableTransitions.map((t) => t.name).join(", ");
      throw new McpError(
        ErrorCode.InvalidParams,
        `Transition "${transitionNameArg}" not found. Available: ${availableNames || "none"}`
      );
    }
    transitionId = transition.id;
  } else {
    throw new McpError(ErrorCode.InvalidParams, "Either transition_id or transition_name is required");
  }

  await apiClient.post(`/rest/api/3/issue/${ticketKey}/transitions`, {
    transition: { id: transitionId },
  });
  return createTextResponse(`Transitioned JIRA ticket ${ticketKey} to new status`);
}

