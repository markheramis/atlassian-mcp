/**
 * Get JIRA priorities tool implementation.
 * Retrieves all available priority options in Jira.
 * Uses caching for better performance as priorities rarely change.
 */

import { AxiosInstance } from "axios";
import { getCached } from "../../utils/cache.js";
import { createSuccessResponse } from "../../utils/response.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Cache TTL for priorities: 10 minutes (priorities change infrequently).
 */
const PRIORITIES_CACHE_TTL_MS = 10 * 60 * 1000;

/**
 * Get all available priority options in Jira.
 * Results are cached for better performance.
 *
 * @param toolArgs - Tool arguments (not used, but kept for consistency)
 * @param apiClient - Atlassian API client
 * @returns Tool execution result with priority options
 */
export async function getJiraPriorities(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const priorities = await getCached(
    "jira:priorities",
    async () => {
      const response = await apiClient.get("/rest/api/3/priority");
      return response.data;
    },
    PRIORITIES_CACHE_TTL_MS
  );

  return createSuccessResponse(priorities);
}

