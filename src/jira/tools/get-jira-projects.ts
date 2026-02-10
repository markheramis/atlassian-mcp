/**
 * Get JIRA projects tool implementation.
 * Retrieves a list of all JIRA projects.
 */

import { AxiosInstance } from "axios";
import { createSuccessResponse } from "../../utils/response.js";
import { optionalArray } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Get all JIRA projects.
 *
 * @param toolArgs - Tool arguments (optional: project_keys to filter)
 * @param apiClient - Atlassian API client
 * @returns Tool execution result with list of projects
 */
export async function getJiraProjects(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const projectKeys = optionalArray(toolArgs?.project_keys);
  let response;

  if (projectKeys && projectKeys.length > 0) {
    response = await apiClient.get("/rest/api/3/project", {
      params: { keys: projectKeys.join(",") },
    });
  } else {
    response = await apiClient.get("/rest/api/3/project/search", {
      params: { maxResults: 100 },
    });
  }
  return createSuccessResponse(response.data);
}

