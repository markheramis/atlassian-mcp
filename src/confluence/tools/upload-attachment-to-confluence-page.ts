/**
 * Upload attachment to Confluence page tool implementation.
 * Uploads files as page attachments.
 */

import { AxiosInstance } from "axios";
import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import FormData from "form-data";
import { createReadStream } from "fs";
import { access, constants } from "fs/promises";
import { createSuccessResponse } from "../../utils/response.js";
import { requireString, optionalString } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Upload an attachment to a Confluence page.
 *
 * @param toolArgs - Tool arguments containing page_id, file_path, and optional comment
 * @param apiClient - Atlassian API client
 * @returns Tool execution result with attachment details
 */
export async function uploadAttachmentToConfluencePage(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const pageId = requireString(toolArgs?.page_id, "page_id");
  const filePath = requireString(toolArgs?.file_path, "file_path");
  const comment = optionalString(toolArgs?.comment);

  try {
    await access(filePath, constants.R_OK);
  } catch {
    throw new McpError(ErrorCode.InvalidParams, `File not found: ${filePath}`);
  }

  // Create form data for multipart/form-data request
  const formData = new FormData();
  formData.append("file", createReadStream(filePath));

  if (comment) {
    formData.append("comment", comment);
  }

  // Confluence API: POST /wiki/rest/api/content/{id}/child/attachment
  // Requires X-Atlassian-Token: nocheck header for XSRF protection
  const response = await apiClient.post(
    `/wiki/rest/api/content/${pageId}/child/attachment`,
    formData,
    {
      headers: {
        ...formData.getHeaders(),
        "X-Atlassian-Token": "nocheck",
      },
    }
  );

  const result = response.data.results?.[0];
  return createSuccessResponse({
    id: result?.id,
    filename: result?.title,
    page_id: pageId,
    url: result?._links?.webui,
  });
}

