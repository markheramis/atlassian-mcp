/**
 * Search JIRA tickets tool implementation.
 * Searches for JIRA tickets using JQL queries.
 */

import { AxiosInstance } from "axios";
import { createSuccessResponse } from "../../utils/response.js";
import { requireString, numberWithDefault } from "../../utils/validation.js";
import { validateAndFixJQL } from "../../utils/jql-validator.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Search for JIRA tickets using JQL.
 *
 * @param toolArgs - Tool arguments containing jql and max_results
 * @param apiClient - Atlassian API client
 * @returns Tool execution result with search results
 */
export async function searchJiraTickets(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const jql = requireString(toolArgs?.jql, "jql");
  const maxResults = numberWithDefault(toolArgs?.max_results, 10);
  const validJql = validateAndFixJQL(jql);

  const response = await apiClient.get("/rest/api/3/search/jql", {
    params: {
      jql: validJql,
      maxResults,
      fields: "summary,status,created,updated",
    },
  });
  return createSuccessResponse(response.data);
}

