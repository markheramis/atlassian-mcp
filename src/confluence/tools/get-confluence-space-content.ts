/**
 * Get Confluence space content tool implementation.
 * Lists all pages and content within a Confluence space.
 */

import { AxiosInstance } from "axios";
import { createSuccessResponse } from "../../utils/response.js";
import { requireString, numberWithDefault } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * List all pages and content within a Confluence space.
 *
 * @param toolArgs - Tool arguments containing space_key and optional limit
 * @param apiClient - Atlassian API client
 * @returns Tool execution result with list of content
 */
export async function getConfluenceSpaceContent(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const spaceKey = requireString(toolArgs?.space_key, "space_key");
  const limit = numberWithDefault(toolArgs?.limit, 100);
  const response = await apiClient.get("/wiki/rest/api/content", {
    params: {
      spaceKey,
      expand: "space,version,ancestors",
      limit,
    },
  });
  return createSuccessResponse(response.data);
}

