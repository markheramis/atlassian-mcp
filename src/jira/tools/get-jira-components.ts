/**
 * Get JIRA project components tool implementation.
 * Retrieves all components for a project.
 */

import { AxiosInstance } from "axios";
import { createSuccessResponse } from "../../utils/response.js";
import { requireEither } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Get all components for a JIRA project.
 *
 * @param toolArgs - Tool arguments containing project_key or project_id
 * @param apiClient - Atlassian API client
 * @returns Tool execution result with project components
 */
export async function getJiraComponents(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const projectIdentifier = requireEither(
    toolArgs?.project_key,
    "project_key",
    toolArgs?.project_id,
    "project_id"
  );
  const response = await apiClient.get(`/rest/api/3/project/${projectIdentifier}/components`);
  return createSuccessResponse(response.data);
}

