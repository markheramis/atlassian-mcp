/**
 * Add comment to Confluence page tool implementation.
 * Adds comments to Confluence pages.
 */

import { AxiosInstance } from "axios";
import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import { createSuccessResponse } from "../../utils/response.js";
import { requireString, optionalString } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Add a comment to a Confluence page.
 * Accepts optional space_key to skip redundant API call for fetching page details.
 *
 * @param toolArgs - Tool arguments containing page_id, comment text, and optional space_key
 * @param apiClient - Atlassian API client
 * @returns Tool execution result with comment details
 */
export async function addCommentToConfluencePage(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const pageId = requireString(toolArgs?.page_id, "page_id");
  const comment = requireString(toolArgs?.comment, "comment");
  let spaceKey = optionalString(toolArgs?.space_key);

  if (!spaceKey) {
    const parentPageResponse = await apiClient.get(`/wiki/rest/api/content/${pageId}`, {
      params: { expand: "space" },
    });
    spaceKey = parentPageResponse.data.space?.key;
  }

  if (!spaceKey) {
    throw new McpError(ErrorCode.InternalError, "Could not determine space from parent page");
  }

  const response = await apiClient.post("/wiki/rest/api/content", {
    type: "comment",
    space: { key: spaceKey },
    container: { id: pageId, type: "page" },
    body: {
      storage: { value: comment, representation: "storage" },
    },
  });

  return createSuccessResponse({
    id: response.data.id,
    page_id: pageId,
    comment,
    url: response.data._links?.webui,
  });
}

