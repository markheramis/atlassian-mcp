/**
 * Search Confluence by label tool implementation.
 * Searches for pages by label.
 */

import { AxiosInstance } from "axios";
import { createSuccessResponse } from "../../utils/response.js";
import { requireString, numberWithDefault } from "../../utils/validation.js";
import { buildLabelSearchCql } from "../../utils/cql.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Search for Confluence pages by label.
 *
 * @param toolArgs - Tool arguments containing label and optional limit
 * @param apiClient - Atlassian API client
 * @returns Tool execution result with search results
 */
export async function searchConfluenceByLabel(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const label = requireString(toolArgs?.label, "label");
  const limit = numberWithDefault(toolArgs?.limit, 10);
  const response = await apiClient.get("/wiki/rest/api/content/search", {
    params: {
      cql: buildLabelSearchCql(label),
      limit,
      expand: "space,version",
    },
  });
  return createSuccessResponse(response.data);
}

