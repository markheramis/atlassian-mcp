/**
 * Link JIRA tickets tool implementation.
 * Links tickets together (relates, blocks, duplicates, etc.).
 */

import { AxiosInstance } from "axios";
import { createTextResponse } from "../../utils/response.js";
import { requireString } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

const DEFAULT_LINK_TYPE = "Relates";

/**
 * Link two JIRA tickets together.
 *
 * @param toolArgs - Tool arguments containing outward_issue_key, inward_issue_key, and link_type
 * @param apiClient - Atlassian API client
 * @returns Tool execution result confirming the link
 */
export async function linkJiraTickets(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const outwardIssueKey = requireString(toolArgs?.outward_issue_key, "outward_issue_key");
  const inwardIssueKey = requireString(toolArgs?.inward_issue_key, "inward_issue_key");
  const linkType = toolArgs?.link_type ? String(toolArgs.link_type) : DEFAULT_LINK_TYPE;

  await apiClient.post("/rest/api/3/issueLink", {
    type: { name: linkType },
    outwardIssue: { key: outwardIssueKey },
    inwardIssue: { key: inwardIssueKey },
  });
  return createTextResponse(`Linked JIRA tickets: ${outwardIssueKey} ${linkType} ${inwardIssueKey}`);
}

