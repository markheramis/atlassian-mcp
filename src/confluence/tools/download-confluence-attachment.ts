/**
 * Download Confluence attachment tool implementation.
 * Returns the download URL and attachment metadata.
 */

import { AxiosInstance } from "axios";
import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import { createSuccessResponse } from "../../utils/response.js";
import { optionalString } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Get download URL and metadata for a Confluence attachment.
 *
 * @param toolArgs - Tool arguments containing attachment_id or page_id and filename
 * @param apiClient - Atlassian API client
 * @returns Tool execution result with download URL and attachment details
 */
export async function downloadConfluenceAttachment(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const attachmentId = optionalString(toolArgs?.attachment_id);
  const pageId = optionalString(toolArgs?.page_id);
  const filename = optionalString(toolArgs?.filename);

  if (attachmentId) {
    const response = await apiClient.get(`/wiki/rest/api/content/${attachmentId}`, {
      params: { expand: "download" },
    });
    return createSuccessResponse({
      id: response.data.id,
      filename: response.data.title,
      download_url: response.data._links?.download,
      webui_url: response.data._links?.webui,
      media_type: response.data.extensions?.mediaType,
      file_size: response.data.extensions?.fileSize,
    });
  }

  if (pageId && filename) {
    const attachmentsResponse = await apiClient.get(
      `/wiki/rest/api/content/${pageId}/child/attachment`,
      { params: { filename, expand: "download" } }
    );
    const attachments = attachmentsResponse.data.results ?? [];
    if (attachments.length === 0) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Attachment "${filename}" not found on page ${pageId}`
      );
    }
    const attachment = attachments[0];
    return createSuccessResponse({
      id: attachment.id,
      filename: attachment.title,
      download_url: attachment._links?.download,
      webui_url: attachment._links?.webui,
      media_type: attachment.extensions?.mediaType,
      file_size: attachment.extensions?.fileSize,
    });
  }

  throw new McpError(
    ErrorCode.InvalidParams,
    "Either attachment_id or (page_id and filename) is required"
  );
}

