/**
 * Search Confluence tool implementation.
 * Searches for content in Confluence using CQL queries.
 */

import { AxiosInstance } from "axios";
import { createSuccessResponse } from "../../utils/response.js";
import { requireString, numberWithDefault } from "../../utils/validation.js";
import { buildTextSearchCql } from "../../utils/cql.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Search for content in Confluence.
 *
 * @param toolArgs - Tool arguments containing query and limit
 * @param apiClient - Atlassian API client
 * @returns Tool execution result with search results
 */
export async function searchConfluence(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const query = requireString(toolArgs?.query, "query");
  const limit = numberWithDefault(toolArgs?.limit, 10);
  const response = await apiClient.get("/wiki/rest/api/content/search", {
    params: {
      cql: buildTextSearchCql(query),
      limit,
      expand: "space",
    },
  });
  return createSuccessResponse(response.data);
}

