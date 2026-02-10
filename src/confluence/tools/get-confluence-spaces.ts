/**
 * Get Confluence spaces tool implementation.
 * Lists all Confluence spaces or gets details of specific spaces.
 * Uses caching when fetching all spaces.
 */

import { AxiosInstance } from "axios";
import { getCached } from "../../utils/cache.js";
import { createSuccessResponse } from "../../utils/response.js";
import { optionalArray } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Cache TTL for all spaces: 5 minutes.
 */
const SPACES_CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * Get all Confluence spaces or filter by space keys.
 * All spaces list is cached for better performance.
 *
 * @param toolArgs - Tool arguments (optional: space_keys to filter)
 * @param apiClient - Atlassian API client
 * @returns Tool execution result with list of spaces
 */
export async function getConfluenceSpaces(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const spaceKeys = optionalArray(toolArgs?.space_keys);
  let spacesData: unknown;

  if (spaceKeys && spaceKeys.length > 0) {
    const response = await apiClient.get("/wiki/rest/api/space", {
      params: { keys: spaceKeys.join(","), limit: 100 },
    });
    spacesData = response.data;
  } else {
    // Get all spaces (cached)
    spacesData = await getCached(
      "confluence:spaces:all",
      async () => {
        const response = await apiClient.get("/wiki/rest/api/space", {
          params: {
            limit: 100
          }
        });
        return response.data;
      },
      SPACES_CACHE_TTL_MS
    );
  }

  return createSuccessResponse(spacesData);
}

