/**
 * Update Confluence comment tool implementation.
 * Edits existing page comments.
 */

import { AxiosInstance } from "axios";
import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import { createSuccessResponse } from "../../utils/response.js";
import { requireString } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Update an existing comment on a Confluence page.
 *
 * @param toolArgs - Tool arguments containing comment_id and comment text
 * @param apiClient - Atlassian API client
 * @returns Tool execution result with updated comment details
 */
export async function updateConfluenceComment(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const commentId = requireString(toolArgs?.comment_id, "comment_id");
  const comment = requireString(toolArgs?.comment, "comment");

  // First, get the current comment to retrieve version and other required fields
  const currentCommentResponse = await apiClient.get(`/wiki/rest/api/content/${commentId}`, {
    params: { expand: "space,version" },
  });

  const currentComment = currentCommentResponse.data;
  const spaceKey = currentComment.space?.key;

  if (!spaceKey) {
    throw new McpError(ErrorCode.InternalError, "Could not determine space from comment");
  }

  const response = await apiClient.put(`/wiki/rest/api/content/${commentId}`, {
    id: commentId,
    type: "comment",
    space: { key: spaceKey },
    version: { number: currentComment.version.number + 1 },
    body: {
      storage: { value: comment, representation: "storage" },
    },
  });

  return createSuccessResponse({
    id: response.data.id,
    comment_id: commentId,
    comment,
    version: response.data.version.number,
    url: response.data._links?.webui,
  });
}

