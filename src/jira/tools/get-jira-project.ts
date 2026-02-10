/**
 * Get JIRA project details tool implementation.
 * Retrieves detailed information about a project.
 */

import { AxiosInstance } from "axios";
import { createSuccessResponse } from "../../utils/response.js";
import { requireEither } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Get detailed information about a JIRA project.
 *
 * @param toolArgs - Tool arguments containing project_key or project_id
 * @param apiClient - Atlassian API client
 * @returns Tool execution result with project details
 */
export async function getJiraProject(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const projectIdentifier = requireEither(
    toolArgs?.project_key,
    "project_key",
    toolArgs?.project_id,
    "project_id"
  );
  const response = await apiClient.get(`/rest/api/3/project/${projectIdentifier}`, {
    params: {
      expand: "description,lead,issueTypes,url,projectKeys,components,projectCategory",
    },
  });
  return createSuccessResponse(response.data);
}

