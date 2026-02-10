/**
 * Tool definitions for MCP server.
 * Defines the available tools and their schemas for JIRA and Confluence.
 * Uses cached definitions to avoid re-computation on each request.
 */

import { ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";

/**
 * Tool definition interface for type safety.
 */
interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, unknown>;
    required: string[];
  };
  annotations?: Record<string, unknown>;
}

/**
 * Cached tool definitions array.
 * Initialized once on first request and reused thereafter.
 */
let cachedToolDefinitions: ToolDefinition[] | null = null;

/**
 * Get cached tool definitions or compute and cache them.
 *
 * @returns Array of tool definitions
 */
function getToolDefinitions(): ToolDefinition[] {
  if (cachedToolDefinitions !== null) {
    return cachedToolDefinitions;
  }

  cachedToolDefinitions = [
        {
          name: "get_jira_ticket",
          description: "Get details of a JIRA ticket by key",
          inputSchema: {
            type: "object",
            properties: {
              ticket_key: {
                type: "string",
                description: "JIRA ticket key (e.g., CPDEV-3371)"
              }
            },
            required: ["ticket_key"]
          },
          annotations: {
            readOnlyHint: true
          }
        },
        {
          name: "search_jira_tickets",
          description: "Search for JIRA tickets using JQL",
          inputSchema: {
            type: "object",
            properties: {
              jql: {
                type: "string",
                description: "JQL query string"
              },
              max_results: {
                type: "number",
                description: "Maximum number of results to return",
                default: 10
              }
            },
            required: ["jql"]
          },
          annotations: {
            readOnlyHint: true
          }
        },
        {
          name: "create_jira_ticket",
          description: "Create a new JIRA ticket",
          inputSchema: {
            type: "object",
            properties: {
              project_key: {
                type: "string",
                description: "Project key (e.g., CPDEV)"
              },
              summary: {
                type: "string",
                description: "Ticket summary/title"
              },
              description: {
                type: "string",
                description: "Ticket description"
              },
              issue_type: {
                type: "string",
                description: "Issue type (e.g., Bug, Task, Story)",
                default: "Task"
              }
            },
            required: ["project_key", "summary", "description"]
          },
          annotations: {
            destructiveHint: true,
            readOnlyHint: false
          }
        },
        {
          name: "add_comment_to_jira_ticket",
          description: "Add a comment to a JIRA ticket",
          inputSchema: {
            type: "object",
            properties: {
              ticket_key: {
                type: "string",
                description: "JIRA ticket key (e.g., CPDEV-3371)"
              },
              comment: {
                type: "string",
                description: "Comment text"
              }
            },
            required: ["ticket_key", "comment"]
          },
          annotations: {
            destructiveHint: true,
            readOnlyHint: false
          }
        },
        {
          name: "update_jira_ticket",
          description: "Update fields of a JIRA ticket (summary, description, priority, labels)",
          inputSchema: {
            type: "object",
            properties: {
              ticket_key: {
                type: "string",
                description: "JIRA ticket key (e.g., CPDEV-3371)"
              },
              summary: {
                type: "string",
                description: "Updated ticket summary/title"
              },
              description: {
                type: "string",
                description: "Updated ticket description"
              },
              priority: {
                type: "string",
                description: "Updated priority name (e.g., High, Medium, Low)"
              },
              labels: {
                type: "array",
                items: { type: "string" },
                description: "Updated labels (array of strings)"
              }
            },
            required: ["ticket_key"]
          },
          annotations: {
            destructiveHint: true,
            readOnlyHint: false,
            idempotentHint: true
          }
        },
        {
          name: "transition_jira_ticket",
          description: "Change JIRA ticket status through workflow transitions",
          inputSchema: {
            type: "object",
            properties: {
              ticket_key: {
                type: "string",
                description: "JIRA ticket key (e.g., CPDEV-3371)"
              },
              transition_id: {
                type: "string",
                description: "Transition ID (use get_jira_ticket_transitions to find available transitions)"
              },
              transition_name: {
                type: "string",
                description: "Transition name (e.g., 'In Progress', 'Done') - alternative to transition_id"
              }
            },
            required: ["ticket_key"]
          },
          annotations: {
            destructiveHint: true,
            readOnlyHint: false
          }
        },
        {
          name: "get_jira_ticket_transitions",
          description: "Get available status transitions for a JIRA ticket",
          inputSchema: {
            type: "object",
            properties: {
              ticket_key: {
                type: "string",
                description: "JIRA ticket key (e.g., CPDEV-3371)"
              }
            },
            required: ["ticket_key"]
          },
          annotations: {
            readOnlyHint: true
          }
        },
        {
          name: "assign_jira_ticket",
          description: "Assign a JIRA ticket to a user",
          inputSchema: {
            type: "object",
            properties: {
              ticket_key: {
                type: "string",
                description: "JIRA ticket key (e.g., CPDEV-3371)"
              },
              assignee: {
                type: "string",
                description: "User accountId, email address, or '-1' to unassign"
              }
            },
            required: ["ticket_key", "assignee"]
          },
          annotations: {
            destructiveHint: true,
            readOnlyHint: false,
            idempotentHint: true
          }
        },
        {
          name: "get_jira_ticket_comments",
          description: "Get all comments on a JIRA ticket",
          inputSchema: {
            type: "object",
            properties: {
              ticket_key: {
                type: "string",
                description: "JIRA ticket key (e.g., CPDEV-3371)"
              }
            },
            required: ["ticket_key"]
          },
          annotations: {
            readOnlyHint: true
          }
        },
        {
          name: "get_jira_projects",
          description: "Get list of all JIRA projects",
          inputSchema: {
            type: "object",
            properties: {
              project_keys: {
                type: "array",
                items: { type: "string" },
                description: "Optional: Filter by specific project keys"
              }
            },
            required: []
          },
          annotations: {
            readOnlyHint: true
          }
        },
        {
          name: "get_confluence_page",
          description: "Get a Confluence page by ID",
          inputSchema: {
            type: "object",
            properties: {
              page_id: {
                type: "string",
                description: "Confluence page ID"
              }
            },
            required: ["page_id"]
          },
          annotations: {
            readOnlyHint: true
          }
        },
        {
          name: "search_confluence",
          description: "Search for content in Confluence",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Search query"
              },
              limit: {
                type: "number",
                description: "Maximum number of results",
                default: 10
              }
            },
            required: ["query"]
          },
          annotations: {
            readOnlyHint: true
          }
        },
        {
          name: "create_confluence_page",
          description: "Create a new Confluence page",
          inputSchema: {
            type: "object",
            properties: {
              space_key: {
                type: "string",
                description: "Confluence space key (e.g., SD, Engineering)"
              },
              title: {
                type: "string",
                description: "Page title"
              },
              content: {
                type: "string",
                description: "Page content in Confluence storage format (HTML)"
              },
              parent_id: {
                type: "string",
                description: "Optional: Parent page ID for creating child pages"
              }
            },
            required: ["space_key", "title"]
          },
          annotations: {
            destructiveHint: true,
            readOnlyHint: false
          }
        },
        {
          name: "update_confluence_page",
          description: "Update an existing Confluence page",
          inputSchema: {
            type: "object",
            properties: {
              page_id: {
                type: "string",
                description: "Confluence page ID"
              },
              title: {
                type: "string",
                description: "Updated page title"
              },
              content: {
                type: "string",
                description: "Updated page content in Confluence storage format (HTML)"
              },
              version: {
                type: "number",
                description: "Optional: Specific version number (for conflict resolution)"
              }
            },
            required: ["page_id"]
          },
          annotations: {
            destructiveHint: true,
            readOnlyHint: false,
            idempotentHint: true
          }
        },
        {
          name: "get_confluence_spaces",
          description: "List all Confluence spaces",
          inputSchema: {
            type: "object",
            properties: {
              space_keys: {
                type: "array",
                items: { type: "string" },
                description: "Optional: Filter by specific space keys"
              }
            },
            required: []
          },
          annotations: {
            readOnlyHint: true
          }
        },
        {
          name: "delete_jira_ticket",
          description: "Delete a JIRA ticket (if permissions allow)",
          inputSchema: {
            type: "object",
            properties: {
              ticket_key: {
                type: "string",
                description: "JIRA ticket key (e.g., CPDEV-3371)"
              },
              delete_subtasks: {
                type: "boolean",
                description: "Whether to delete subtasks",
                default: false
              }
            },
            required: ["ticket_key"]
          },
          annotations: {
            destructiveHint: true,
            readOnlyHint: false
          }
        },
        {
          name: "add_attachment_to_jira_ticket",
          description: "Upload file attachment to a JIRA ticket",
          inputSchema: {
            type: "object",
            properties: {
              ticket_key: {
                type: "string",
                description: "JIRA ticket key (e.g., CPDEV-3371)"
              },
              file_path: {
                type: "string",
                description: "Path to the file to attach"
              },
              filename: {
                type: "string",
                description: "Optional: Custom filename for the attachment"
              }
            },
            required: ["ticket_key", "file_path"]
          },
          annotations: {
            destructiveHint: true,
            readOnlyHint: false
          }
        },
        {
          name: "update_jira_comment",
          description: "Edit an existing comment on a JIRA ticket",
          inputSchema: {
            type: "object",
            properties: {
              ticket_key: {
                type: "string",
                description: "JIRA ticket key (e.g., CPDEV-3371)"
              },
              comment_id: {
                type: "string",
                description: "Comment ID to update"
              },
              comment: {
                type: "string",
                description: "Updated comment text"
              }
            },
            required: ["ticket_key", "comment_id", "comment"]
          },
          annotations: {
            destructiveHint: true,
            readOnlyHint: false,
            idempotentHint: true
          }
        },
        {
          name: "delete_jira_comment",
          description: "Delete a comment from a JIRA ticket",
          inputSchema: {
            type: "object",
            properties: {
              ticket_key: {
                type: "string",
                description: "JIRA ticket key (e.g., CPDEV-3371)"
              },
              comment_id: {
                type: "string",
                description: "Comment ID to delete"
              }
            },
            required: ["ticket_key", "comment_id"]
          },
          annotations: {
            destructiveHint: true,
            readOnlyHint: false
          }
        },
        {
          name: "link_jira_tickets",
          description: "Link two JIRA tickets together (relates, blocks, duplicates, etc.)",
          inputSchema: {
            type: "object",
            properties: {
              outward_issue_key: {
                type: "string",
                description: "Outward issue key (e.g., CPDEV-3371)"
              },
              inward_issue_key: {
                type: "string",
                description: "Inward issue key (e.g., CPDEV-3372)"
              },
              link_type: {
                type: "string",
                description: "Link type (e.g., Relates, Duplicates, Blocks, Cloners)",
                default: "Relates"
              }
            },
            required: ["outward_issue_key", "inward_issue_key"]
          },
          annotations: {
            destructiveHint: true,
            readOnlyHint: false
          }
        },
        {
          name: "add_worklog_to_jira_ticket",
          description: "Log time spent on a JIRA ticket",
          inputSchema: {
            type: "object",
            properties: {
              ticket_key: {
                type: "string",
                description: "JIRA ticket key (e.g., CPDEV-3371)"
              },
              time_spent: {
                type: "string",
                description: "Time spent (e.g., '2h 30m', '1d', '45m')"
              },
              started: {
                type: "string",
                description: "Start date/time in ISO 8601 format (e.g., '2025-12-03T10:00:00.000+0000')"
              },
              comment: {
                type: "string",
                description: "Optional: Comment describing the work done"
              }
            },
            required: ["ticket_key", "time_spent", "started"]
          },
          annotations: {
            destructiveHint: true,
            readOnlyHint: false
          }
        },
        {
          name: "get_jira_ticket_worklogs",
          description: "Retrieve all worklog entries for a JIRA ticket",
          inputSchema: {
            type: "object",
            properties: {
              ticket_key: {
                type: "string",
                description: "JIRA ticket key (e.g., CPDEV-3371)"
              }
            },
            required: ["ticket_key"]
          },
          annotations: {
            readOnlyHint: true
          }
        },
        {
          name: "update_jira_worklog",
          description: "Modify an existing worklog entry on a JIRA ticket",
          inputSchema: {
            type: "object",
            properties: {
              ticket_key: {
                type: "string",
                description: "JIRA ticket key (e.g., CPDEV-3371)"
              },
              worklog_id: {
                type: "string",
                description: "Worklog ID to update"
              },
              time_spent: {
                type: "string",
                description: "Updated time spent (e.g., '2h 30m', '1d', '45m')"
              },
              started: {
                type: "string",
                description: "Updated start date/time in ISO 8601 format"
              },
              comment: {
                type: "string",
                description: "Updated comment describing the work done"
              }
            },
            required: ["ticket_key", "worklog_id"]
          },
          annotations: {
            destructiveHint: true,
            readOnlyHint: false,
            idempotentHint: true
          }
        },
        {
          name: "delete_jira_worklog",
          description: "Remove a worklog entry from a JIRA ticket",
          inputSchema: {
            type: "object",
            properties: {
              ticket_key: {
                type: "string",
                description: "JIRA ticket key (e.g., CPDEV-3371)"
              },
              worklog_id: {
                type: "string",
                description: "Worklog ID to delete"
              }
            },
            required: ["ticket_key", "worklog_id"]
          },
          annotations: {
            destructiveHint: true,
            readOnlyHint: false
          }
        },
        {
          name: "add_watcher_to_jira_ticket",
          description: "Add a user as a watcher to a JIRA ticket",
          inputSchema: {
            type: "object",
            properties: {
              ticket_key: {
                type: "string",
                description: "JIRA ticket key (e.g., CPDEV-3371)"
              },
              account_id: {
                type: "string",
                description: "User account ID (e.g., '557058:dba3e95c-4829-4a28-b0ed-e0efa4044a92')"
              },
              email: {
                type: "string",
                description: "User email address (alternative to account_id, will be looked up)"
              }
            },
            required: ["ticket_key"]
          },
          annotations: {
            destructiveHint: true,
            readOnlyHint: false,
            idempotentHint: true
          }
        },
        {
          name: "remove_watcher_from_jira_ticket",
          description: "Remove a watcher from a JIRA ticket",
          inputSchema: {
            type: "object",
            properties: {
              ticket_key: {
                type: "string",
                description: "JIRA ticket key (e.g., CPDEV-3371)"
              },
              username: {
                type: "string",
                description: "Username of the watcher to remove"
              },
              account_id: {
                type: "string",
                description: "Account ID of the watcher (alternative to username, will be looked up)"
              }
            },
            required: ["ticket_key"]
          },
          annotations: {
            destructiveHint: true,
            readOnlyHint: false,
            idempotentHint: true
          }
        },
        {
          name: "get_jira_ticket_watchers",
          description: "List all watchers of a JIRA ticket",
          inputSchema: {
            type: "object",
            properties: {
              ticket_key: {
                type: "string",
                description: "JIRA ticket key (e.g., CPDEV-3371)"
              }
            },
            required: ["ticket_key"]
          },
          annotations: {
            readOnlyHint: true
          }
        },
        {
          name: "add_label_to_jira_ticket",
          description: "Add a label to a JIRA ticket for categorization",
          inputSchema: {
            type: "object",
            properties: {
              ticket_key: {
                type: "string",
                description: "JIRA ticket key (e.g., CPDEV-3371)"
              },
              label: {
                type: "string",
                description: "Label to add to the ticket"
              }
            },
            required: ["ticket_key", "label"]
          },
          annotations: {
            destructiveHint: true,
            readOnlyHint: false,
            idempotentHint: true
          }
        },
        {
          name: "remove_label_from_jira_ticket",
          description: "Remove a label from a JIRA ticket",
          inputSchema: {
            type: "object",
            properties: {
              ticket_key: {
                type: "string",
                description: "JIRA ticket key (e.g., CPDEV-3371)"
              },
              label: {
                type: "string",
                description: "Label to remove from the ticket"
              }
            },
            required: ["ticket_key", "label"]
          },
          annotations: {
            destructiveHint: true,
            readOnlyHint: false,
            idempotentHint: true
          }
        },
        {
          name: "get_jira_components",
          description: "Get all components for a JIRA project",
          inputSchema: {
            type: "object",
            properties: {
              project_key: {
                type: "string",
                description: "Project key (e.g., SCRUM)"
              },
              project_id: {
                type: "string",
                description: "Project ID (alternative to project_key)"
              }
            },
            required: []
          },
          annotations: {
            readOnlyHint: true
          }
        },
        {
          name: "get_jira_project",
          description: "Get detailed information about a JIRA project",
          inputSchema: {
            type: "object",
            properties: {
              project_key: {
                type: "string",
                description: "Project key (e.g., SCRUM)"
              },
              project_id: {
                type: "string",
                description: "Project ID (alternative to project_key)"
              }
            },
            required: []
          },
          annotations: {
            readOnlyHint: true
          }
        },
        {
          name: "get_jira_issue_types",
          description: "Get available issue types for a project or globally",
          inputSchema: {
            type: "object",
            properties: {
              project_key: {
                type: "string",
                description: "Project key (optional, if not provided returns all issue types)"
              },
              project_id: {
                type: "string",
                description: "Project ID (optional, alternative to project_key)"
              }
            },
            required: []
          },
          annotations: {
            readOnlyHint: true
          }
        },
        {
          name: "get_jira_priorities",
          description: "Get all available priority options in Jira",
          inputSchema: {
            type: "object",
            properties: {},
            required: []
          },
          annotations: {
            readOnlyHint: true
          }
        },
        {
          name: "get_jira_statuses",
          description: "Get all available statuses for a JIRA project",
          inputSchema: {
            type: "object",
            properties: {
              project_key: {
                type: "string",
                description: "Project key (e.g., SCRUM)"
              },
              project_id: {
                type: "string",
                description: "Project ID (alternative to project_key)"
              }
            },
            required: []
          },
          annotations: {
            readOnlyHint: true
          }
        },
        {
          name: "delete_confluence_page",
          description: "Delete a Confluence page",
          inputSchema: {
            type: "object",
            properties: {
              page_id: {
                type: "string",
                description: "Confluence page ID"
              }
            },
            required: ["page_id"]
          },
          annotations: {
            destructiveHint: true,
            readOnlyHint: false
          }
        },
        {
          name: "add_comment_to_confluence_page",
          description: "Add a comment to a Confluence page",
          inputSchema: {
            type: "object",
            properties: {
              page_id: {
                type: "string",
                description: "Confluence page ID"
              },
              comment: {
                type: "string",
                description: "Comment text"
              },
              space_key: {
                type: "string",
                description: "Optional: Space key (skips API call if provided)"
              }
            },
            required: ["page_id", "comment"]
          },
          annotations: {
            destructiveHint: true,
            readOnlyHint: false
          }
        },
        {
          name: "get_confluence_page_comments",
          description: "Get all comments on a Confluence page",
          inputSchema: {
            type: "object",
            properties: {
              page_id: {
                type: "string",
                description: "Confluence page ID"
              }
            },
            required: ["page_id"]
          },
          annotations: {
            readOnlyHint: true
          }
        },
        {
          name: "get_confluence_space",
          description: "Get detailed information about a specific Confluence space",
          inputSchema: {
            type: "object",
            properties: {
              space_key: {
                type: "string",
                description: "Confluence space key (e.g., SD, Engineering)"
              }
            },
            required: ["space_key"]
          },
          annotations: {
            readOnlyHint: true
          }
        },
        {
          name: "get_confluence_space_content",
          description: "List all pages and content within a Confluence space",
          inputSchema: {
            type: "object",
            properties: {
              space_key: {
                type: "string",
                description: "Confluence space key (e.g., SD, Engineering)"
              },
              limit: {
                type: "number",
                description: "Maximum number of results",
                default: 100
              }
            },
            required: ["space_key"]
          },
          annotations: {
            readOnlyHint: true
          }
        },
        {
          name: "get_confluence_page_attachments",
          description: "List all attachments on a Confluence page",
          inputSchema: {
            type: "object",
            properties: {
              page_id: {
                type: "string",
                description: "Confluence page ID"
              }
            },
            required: ["page_id"]
          },
          annotations: {
            readOnlyHint: true
          }
        },
        {
          name: "upload_attachment_to_confluence_page",
          description: "Upload a file as an attachment to a Confluence page",
          inputSchema: {
            type: "object",
            properties: {
              page_id: {
                type: "string",
                description: "Confluence page ID"
              },
              file_path: {
                type: "string",
                description: "Path to the file to upload"
              },
              comment: {
                type: "string",
                description: "Optional comment for the attachment"
              }
            },
            required: ["page_id", "file_path"]
          },
          annotations: {
            destructiveHint: true,
            readOnlyHint: false
          }
        },
        {
          name: "download_confluence_attachment",
          description: "Get download URL and metadata for a Confluence attachment",
          inputSchema: {
            type: "object",
            properties: {
              attachment_id: {
                type: "string",
                description: "Attachment ID (alternative to page_id + filename)"
              },
              page_id: {
                type: "string",
                description: "Page ID (required if attachment_id not provided)"
              },
              filename: {
                type: "string",
                description: "Filename (required if attachment_id not provided)"
              }
            },
            required: []
          },
          annotations: {
            readOnlyHint: true
          }
        },
        {
          name: "add_label_to_confluence_page",
          description: "Add a label to a Confluence page for categorization",
          inputSchema: {
            type: "object",
            properties: {
              page_id: {
                type: "string",
                description: "Confluence page ID"
              },
              label: {
                type: "string",
                description: "Label to add to the page"
              }
            },
            required: ["page_id", "label"]
          },
          annotations: {
            destructiveHint: true,
            readOnlyHint: false,
            idempotentHint: true
          }
        },
        {
          name: "remove_label_from_confluence_page",
          description: "Remove a label from a Confluence page",
          inputSchema: {
            type: "object",
            properties: {
              page_id: {
                type: "string",
                description: "Confluence page ID"
              },
              label: {
                type: "string",
                description: "Label to remove from the page"
              }
            },
            required: ["page_id", "label"]
          },
          annotations: {
            destructiveHint: true,
            readOnlyHint: false,
            idempotentHint: true
          }
        },
        {
          name: "get_confluence_page_labels",
          description: "Get all labels on a Confluence page",
          inputSchema: {
            type: "object",
            properties: {
              page_id: {
                type: "string",
                description: "Confluence page ID"
              }
            },
            required: ["page_id"]
          },
          annotations: {
            readOnlyHint: true
          }
        },
        {
          name: "get_confluence_page_history",
          description: "Get version history of a Confluence page",
          inputSchema: {
            type: "object",
            properties: {
              page_id: {
                type: "string",
                description: "Confluence page ID"
              }
            },
            required: ["page_id"]
          },
          annotations: {
            readOnlyHint: true
          }
        },
        {
          name: "get_confluence_page_children",
          description: "Get child pages (sub-pages) of a Confluence page",
          inputSchema: {
            type: "object",
            properties: {
              page_id: {
                type: "string",
                description: "Confluence page ID"
              },
              limit: {
                type: "number",
                description: "Maximum number of results",
                default: 25
              }
            },
            required: ["page_id"]
          },
          annotations: {
            readOnlyHint: true
          }
        },
        {
          name: "get_confluence_page_ancestors",
          description: "Get parent pages (ancestors) of a Confluence page",
          inputSchema: {
            type: "object",
            properties: {
              page_id: {
                type: "string",
                description: "Confluence page ID"
              }
            },
            required: ["page_id"]
          },
          annotations: {
            readOnlyHint: true
          }
        },
        {
          name: "search_confluence_by_space",
          description: "Search for content within a specific Confluence space",
          inputSchema: {
            type: "object",
            properties: {
              space_key: {
                type: "string",
                description: "Confluence space key (e.g., SD, Engineering)"
              },
              query: {
                type: "string",
                description: "Search query text"
              },
              limit: {
                type: "number",
                description: "Maximum number of results",
                default: 10
              }
            },
            required: ["space_key", "query"]
          },
          annotations: {
            readOnlyHint: true
          }
        },
        {
          name: "search_confluence_by_label",
          description: "Search for Confluence pages by label",
          inputSchema: {
            type: "object",
            properties: {
              label: {
                type: "string",
                description: "Label to search for"
              },
              limit: {
                type: "number",
                description: "Maximum number of results",
                default: 10
              }
            },
            required: ["label"]
          },
          annotations: {
            readOnlyHint: true
          }
        },
        {
          name: "update_confluence_comment",
          description: "Edit an existing comment on a Confluence page",
          inputSchema: {
            type: "object",
            properties: {
              comment_id: {
                type: "string",
                description: "Comment ID to update"
              },
              comment: {
                type: "string",
                description: "Updated comment text"
              }
            },
            required: ["comment_id", "comment"]
          },
          annotations: {
            destructiveHint: true,
            readOnlyHint: false,
            idempotentHint: true
          }
        },
        {
          name: "delete_confluence_comment",
          description: "Delete a comment from a Confluence page",
          inputSchema: {
            type: "object",
            properties: {
              comment_id: {
                type: "string",
                description: "Comment ID to delete"
              }
            },
            required: ["comment_id"]
          },
          annotations: {
            destructiveHint: true,
            readOnlyHint: false
          }
        }
  ];

  return cachedToolDefinitions;
}

/**
 * Register tool definitions with the MCP server.
 *
 * @param server - MCP server instance
 */
export function registerToolDefinitions(server: Server): void {
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: getToolDefinitions() };
  });
}

