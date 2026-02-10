/**
 * Create Confluence page tool implementation.
 * Creates a new Confluence page with content.
 */

import { AxiosInstance } from "axios";
import { createSuccessResponse } from "../../utils/response.js";
import { requireString, optionalString } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Create a new Confluence page.
 *
 * @param toolArgs - Tool arguments containing space_key, title, content, and optional parent_id
 * @param apiClient - Atlassian API client
 * @returns Tool execution result with created page details
 */
export async function createConfluencePage(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const spaceKey = requireString(toolArgs?.space_key, "space_key");
  const title = requireString(toolArgs?.title, "title");
  const content = optionalString(toolArgs?.content) ?? "";
  const parentId = optionalString(toolArgs?.parent_id);

  const pagePayload: Record<string, unknown> = {
    type: "page",
    title,
    space: { key: spaceKey },
    body: {
      storage: { value: content, representation: "storage" },
    },
  };

  if (parentId) {
    pagePayload.ancestors = [{ id: parentId }];
  }

  const response = await apiClient.post("/wiki/rest/api/content", pagePayload);
  const data = {
    id: response.data.id,
    title: response.data.title,
    space: response.data.space?.key,
    url: response.data._links?.webui,
  };
  return createSuccessResponse(data);
}

