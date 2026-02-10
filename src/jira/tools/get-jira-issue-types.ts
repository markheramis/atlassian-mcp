/**
 * Get JIRA issue types tool implementation.
 * Retrieves available issue types for a project or globally.
 * Uses caching for global issue types queries.
 */

import { AxiosInstance } from "axios";
import { getCached } from "../../utils/cache.js";
import { createSuccessResponse } from "../../utils/response.js";
import { optionalString } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

const ISSUE_TYPES_CACHE_TTL_MS = 10 * 60 * 1000;

/**
 * Get available issue types for a JIRA project or globally.
 * Global issue types are cached for better performance.
 *
 * @param toolArgs - Tool arguments containing optional project_key or project_id
 * @param apiClient - Atlassian API client
 * @returns Tool execution result with issue types
 */
export async function getJiraIssueTypes(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const projectKey = optionalString(toolArgs?.project_key);
  const projectId = optionalString(toolArgs?.project_id);
  let issueTypes: unknown;

  if (projectKey || projectId) {
    const projectIdentifier = projectKey ?? projectId;
    const projectResponse = await apiClient.get(`/rest/api/3/project/${projectIdentifier}`, {
      params: { expand: "issueTypes" },
    });
    issueTypes = projectResponse.data.issueTypes ?? [];
  } else {
    issueTypes = await getCached(
      "jira:issueTypes:global",
      async () => {
        const response = await apiClient.get("/rest/api/3/issuetype");
        return response.data;
      },
      ISSUE_TYPES_CACHE_TTL_MS
    );
  }
  return createSuccessResponse(issueTypes);
}

