/**
 * Update Confluence page tool implementation.
 * Updates existing Confluence page content, title, and metadata.
 */

import { AxiosInstance } from "axios";
import { createTextResponse } from "../../utils/response.js";
import { requireString, optionalString } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Update an existing Confluence page.
 *
 * @param toolArgs - Tool arguments containing page_id and optional title, content, version
 * @param apiClient - Atlassian API client
 * @returns Tool execution result confirming the update
 */
export async function updateConfluencePage(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const pageId = requireString(toolArgs?.page_id, "page_id");

  // First, get the current page to retrieve the current version and required fields
  const currentPageResponse = await apiClient.get(`/wiki/rest/api/content/${pageId}`, {
    params: {
      expand: "version,space"
    }
  });

  const currentPage = currentPageResponse.data;
  const currentVersion = currentPage.version?.number || 1;
  const nextVersion = currentVersion + 1;

  // Build update payload with required fields
  const updatePayload: Record<string, unknown> = {
    id: pageId,
    type: currentPage.type || "page",
    space: currentPage.space || { key: currentPage.space?.key },
    version: {
      number: nextVersion
    }
  };

  const titleArg = optionalString(toolArgs?.title);
  const contentArg = optionalString(toolArgs?.content);
  const versionArg = toolArgs?.version;

  updatePayload.title = titleArg !== undefined ? titleArg : currentPage.title;

  if (contentArg !== undefined) {
    updatePayload.body = {
      storage: { value: contentArg, representation: "storage" },
    };
  } else {
    updatePayload.body = currentPage.body;
  }

  if (versionArg !== undefined) {
    updatePayload.version = { number: Number(versionArg) };
  }

  await apiClient.put(`/wiki/rest/api/content/${pageId}`, updatePayload);
  return createTextResponse(`Updated Confluence page: ${pageId}`);
}

