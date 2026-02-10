/**
 * Add attachment to JIRA ticket tool implementation.
 * Uploads file attachments to JIRA tickets.
 */

import { AxiosInstance } from "axios";
import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import { createReadStream } from "fs";
import { access, constants } from "fs/promises";
import FormData from "form-data";
import { createSuccessResponse } from "../../utils/response.js";
import { requireString, optionalString } from "../../utils/validation.js";
import { ToolResponse } from "../../types/tools.js";

/**
 * Add an attachment to a JIRA ticket.
 *
 * @param toolArgs - Tool arguments containing ticket_key, file_path, and optional filename
 * @param apiClient - Atlassian API client
 * @returns Tool execution result with attachment details
 */
export async function addAttachmentToJiraTicket(
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const ticketKey = requireString(toolArgs?.ticket_key, "ticket_key");
  const filePath = requireString(toolArgs?.file_path, "file_path");
  const filename = optionalString(toolArgs?.filename);

  try {
    await access(filePath, constants.R_OK);
  } catch {
    throw new McpError(ErrorCode.InvalidParams, `File not found: ${filePath}`);
  }

  const fileName = filename ?? filePath.split("/").pop() ?? "attachment";
  const formData = new FormData();
  formData.append("file", createReadStream(filePath), fileName);

  const response = await apiClient.post(
    `/rest/api/3/issue/${ticketKey}/attachments`,
    formData,
    {
      headers: {
        ...formData.getHeaders(),
        "X-Atlassian-Token": "no-check",
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    }
  );

  return createSuccessResponse({
    ticket_key: ticketKey,
    attachments: response.data,
    message: `Successfully attached file to ticket ${ticketKey}`,
  });
}