/**
 * Get Confluence space tool implementation.
 * Gets detailed information about a specific Confluence space.
 */

import { AxiosInstance } from "axios";
import { createSuccessResponse } from "../../utils/response.js";
import { requireString } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Get detailed information about a Confluence space.
 *
 * @param toolArgs - Tool arguments containing space_key
 * @param apiClient - Atlassian API client
 * @returns Tool execution result with space details
 */
export async function getConfluenceSpace(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const spaceKey = requireString(toolArgs?.space_key, "space_key");
  const response = await apiClient.get(`/wiki/rest/api/space/${spaceKey}`, {
    params: { expand: "homepage,metadata.labels,description" },
  });
  return createSuccessResponse(response.data);
}

