/**
 * Search Confluence by space tool implementation.
 * Searches for content within a specific space.
 */

import { AxiosInstance } from "axios";
import { createSuccessResponse } from "../../utils/response.js";
import { requireString, numberWithDefault } from "../../utils/validation.js";
import { buildTextSearchCql } from "../../utils/cql.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Search for content within a specific Confluence space.
 *
 * @param toolArgs - Tool arguments containing space_key, query, and optional limit
 * @param apiClient - Atlassian API client
 * @returns Tool execution result with search results
 */
export async function searchConfluenceBySpace(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const spaceKey = requireString(toolArgs?.space_key, "space_key");
  const query = requireString(toolArgs?.query, "query");
  const limit = numberWithDefault(toolArgs?.limit, 10);
  const response = await apiClient.get("/wiki/rest/api/content/search", {
    params: {
      cql: buildTextSearchCql(query, spaceKey),
      limit,
      expand: "space,version",
    },
  });
  return createSuccessResponse(response.data);
}

