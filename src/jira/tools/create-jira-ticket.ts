/**
 * Create JIRA ticket tool implementation.
 * Creates a new JIRA ticket with the specified details.
 */

import { AxiosInstance } from "axios";
import { createAdfDocument } from "../../utils/adf.js";
import { createTextResponse } from "../../utils/response.js";
import { requireString } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

const DEFAULT_ISSUE_TYPE = "Task";

/**
 * Create a new JIRA ticket.
 *
 * @param toolArgs - Tool arguments containing project_key, summary, description, and issue_type
 * @param apiClient - Atlassian API client
 * @returns Tool execution result with created ticket key
 */
export async function createJiraTicket(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const projectKey = requireString(toolArgs?.project_key, "project_key");
  const summary = requireString(toolArgs?.summary, "summary");
  const description = requireString(toolArgs?.description, "description");
  const issueType = toolArgs?.issue_type ? String(toolArgs.issue_type) : DEFAULT_ISSUE_TYPE;

  const response = await apiClient.post("/rest/api/3/issue", {
    fields: {
      project: { key: projectKey },
      summary,
      description: createAdfDocument(description),
      issuetype: { name: issueType },
    },
  });
  return createTextResponse(`Created JIRA ticket: ${response.data.key}`);
}

