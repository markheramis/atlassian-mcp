/**
 * JIRA tools module.
 * Exports all JIRA tool implementations and the main handler.
 * Uses a registry pattern for O(1) tool lookup.
 */

import { AxiosInstance } from "axios";
import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import { ToolHandler, ToolRegistry, ToolResponse } from "../types/tools.js";
import { getJiraTicket } from "./tools/get-jira-ticket.js";
import { searchJiraTickets } from "./tools/search-jira-tickets.js";
import { createJiraTicket } from "./tools/create-jira-ticket.js";
import { addCommentToJiraTicket } from "./tools/add-comment-to-jira-ticket.js";
import { updateJiraTicket } from "./tools/update-jira-ticket.js";
import { transitionJiraTicket } from "./tools/transition-jira-ticket.js";
import { getJiraTicketTransitions } from "./tools/get-jira-ticket-transitions.js";
import { assignJiraTicket } from "./tools/assign-jira-ticket.js";
import { getJiraTicketComments } from "./tools/get-jira-ticket-comments.js";
import { getJiraProjects } from "./tools/get-jira-projects.js";
import { deleteJiraTicket } from "./tools/delete-jira-ticket.js";
import { addAttachmentToJiraTicket } from "./tools/add-attachment-to-jira-ticket.js";
import { updateJiraComment } from "./tools/update-jira-comment.js";
import { deleteJiraComment } from "./tools/delete-jira-comment.js";
import { linkJiraTickets } from "./tools/link-jira-tickets.js";
import { addWorklogToJiraTicket } from "./tools/add-worklog-to-jira-ticket.js";
import { getJiraTicketWorklogs } from "./tools/get-jira-ticket-worklogs.js";
import { updateJiraWorklog } from "./tools/update-jira-worklog.js";
import { deleteJiraWorklog } from "./tools/delete-jira-worklog.js";
import { addWatcherToJiraTicket } from "./tools/add-watcher-to-jira-ticket.js";
import { removeWatcherFromJiraTicket } from "./tools/remove-watcher-from-jira-ticket.js";
import { getJiraTicketWatchers } from "./tools/get-jira-ticket-watchers.js";
import { addLabelToJiraTicket } from "./tools/add-label-to-jira-ticket.js";
import { removeLabelFromJiraTicket } from "./tools/remove-label-from-jira-ticket.js";
import { getJiraComponents } from "./tools/get-jira-components.js";
import { getJiraProject } from "./tools/get-jira-project.js";
import { getJiraIssueTypes } from "./tools/get-jira-issue-types.js";
import { getJiraPriorities } from "./tools/get-jira-priorities.js";
import { getJiraStatuses } from "./tools/get-jira-statuses.js";

/**
 * Registry mapping Jira tool names to their handler functions.
 * Exported for use by the tool executor (single combined registry).
 */
export const jiraToolRegistry: ToolRegistry = {
  "get_jira_ticket": getJiraTicket,
  "search_jira_tickets": searchJiraTickets,
  "create_jira_ticket": createJiraTicket,
  "add_comment_to_jira_ticket": addCommentToJiraTicket,
  "update_jira_ticket": updateJiraTicket,
  "transition_jira_ticket": transitionJiraTicket,
  "get_jira_ticket_transitions": getJiraTicketTransitions,
  "assign_jira_ticket": assignJiraTicket,
  "get_jira_ticket_comments": getJiraTicketComments,
  "get_jira_projects": getJiraProjects,
  "delete_jira_ticket": deleteJiraTicket,
  "add_attachment_to_jira_ticket": addAttachmentToJiraTicket,
  "update_jira_comment": updateJiraComment,
  "delete_jira_comment": deleteJiraComment,
  "link_jira_tickets": linkJiraTickets,
  "add_worklog_to_jira_ticket": addWorklogToJiraTicket,
  "get_jira_ticket_worklogs": getJiraTicketWorklogs,
  "update_jira_worklog": updateJiraWorklog,
  "delete_jira_worklog": deleteJiraWorklog,
  "add_watcher_to_jira_ticket": addWatcherToJiraTicket,
  "remove_watcher_from_jira_ticket": removeWatcherFromJiraTicket,
  "get_jira_ticket_watchers": getJiraTicketWatchers,
  "add_label_to_jira_ticket": addLabelToJiraTicket,
  "remove_label_from_jira_ticket": removeLabelFromJiraTicket,
  "get_jira_components": getJiraComponents,
  "get_jira_project": getJiraProject,
  "get_jira_issue_types": getJiraIssueTypes,
  "get_jira_priorities": getJiraPriorities,
  "get_jira_statuses": getJiraStatuses,
};

/**
 * Handle JIRA tool execution.
 * Routes to the appropriate tool implementation based on tool name using registry lookup.
 *
 * @param toolName - Name of the tool to execute
 * @param toolArgs - Tool arguments
 * @param apiClient - Atlassian API client
 * @returns Tool execution result
 */
export async function handleJiraTool(
  toolName: string,
  toolArgs: Record<string, unknown>,
  apiClient: AxiosInstance
): Promise<ToolResponse> {
  const handler: ToolHandler | undefined = jiraToolRegistry[toolName];

  if (!handler) {
    throw new McpError(ErrorCode.MethodNotFound, `Unknown JIRA tool: ${toolName}`);
  }

  return handler(toolArgs, apiClient);
}
