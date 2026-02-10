/**
 * Confluence tools module.
 * Exports all Confluence tool implementations and the main handler.
 * Uses a registry pattern for O(1) tool lookup.
 */

import { AxiosInstance } from "axios";
import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import { ToolHandler, ToolRegistry, ToolResponse } from "../types/tools.js";
import { getConfluencePage } from "./tools/get-confluence-page.js";
import { searchConfluence } from "./tools/search-confluence.js";
import { createConfluencePage } from "./tools/create-confluence-page.js";
import { updateConfluencePage } from "./tools/update-confluence-page.js";
import { getConfluenceSpaces } from "./tools/get-confluence-spaces.js";
import { deleteConfluencePage } from "./tools/delete-confluence-page.js";
import { addCommentToConfluencePage } from "./tools/add-comment-to-confluence-page.js";
import { getConfluencePageComments } from "./tools/get-confluence-page-comments.js";
import { getConfluenceSpace } from "./tools/get-confluence-space.js";
import { getConfluenceSpaceContent } from "./tools/get-confluence-space-content.js";
import { getConfluencePageAttachments } from "./tools/get-confluence-page-attachments.js";
import { uploadAttachmentToConfluencePage } from "./tools/upload-attachment-to-confluence-page.js";
import { downloadConfluenceAttachment } from "./tools/download-confluence-attachment.js";
import { addLabelToConfluencePage } from "./tools/add-label-to-confluence-page.js";
import { removeLabelFromConfluencePage } from "./tools/remove-label-from-confluence-page.js";
import { getConfluencePageLabels } from "./tools/get-confluence-page-labels.js";
import { getConfluencePageHistory } from "./tools/get-confluence-page-history.js";
import { getConfluencePageChildren } from "./tools/get-confluence-page-children.js";
import { getConfluencePageAncestors } from "./tools/get-confluence-page-ancestors.js";
import { searchConfluenceBySpace } from "./tools/search-confluence-by-space.js";
import { searchConfluenceByLabel } from "./tools/search-confluence-by-label.js";
import { updateConfluenceComment } from "./tools/update-confluence-comment.js";
import { deleteConfluenceComment } from "./tools/delete-confluence-comment.js";

/**
 * Registry mapping Confluence tool names to their handler functions.
 * Exported for use by the tool executor (single combined registry).
 */
export const confluenceToolRegistry: ToolRegistry = {
  "get_confluence_page": getConfluencePage,
  "search_confluence": searchConfluence,
  "create_confluence_page": createConfluencePage,
  "update_confluence_page": updateConfluencePage,
  "get_confluence_spaces": getConfluenceSpaces,
  "delete_confluence_page": deleteConfluencePage,
  "add_comment_to_confluence_page": addCommentToConfluencePage,
  "get_confluence_page_comments": getConfluencePageComments,
  "get_confluence_space": getConfluenceSpace,
  "get_confluence_space_content": getConfluenceSpaceContent,
  "get_confluence_page_attachments": getConfluencePageAttachments,
  "upload_attachment_to_confluence_page": uploadAttachmentToConfluencePage,
  "download_confluence_attachment": downloadConfluenceAttachment,
  "add_label_to_confluence_page": addLabelToConfluencePage,
  "remove_label_from_confluence_page": removeLabelFromConfluencePage,
  "get_confluence_page_labels": getConfluencePageLabels,
  "get_confluence_page_history": getConfluencePageHistory,
  "get_confluence_page_children": getConfluencePageChildren,
  "get_confluence_page_ancestors": getConfluencePageAncestors,
  "search_confluence_by_space": searchConfluenceBySpace,
  "search_confluence_by_label": searchConfluenceByLabel,
  "update_confluence_comment": updateConfluenceComment,
  "delete_confluence_comment": deleteConfluenceComment,
};

/**
 * Handle Confluence tool execution.
 * Routes to the appropriate tool implementation based on tool name using registry lookup.
 *
 * @param toolName - Name of the tool to execute
 * @param toolArgs - Tool arguments
 * @param apiClient - Atlassian API client
 * @returns Tool execution result
 */
export async function handleConfluenceTool(
  toolName: string,
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const handler: ToolHandler | undefined = confluenceToolRegistry[toolName];

  if (!handler) {
    throw new McpError(ErrorCode.MethodNotFound, `Unknown Confluence tool: ${toolName}`);
  }

  return handler(toolArgs, apiClient);
}
