/**
 * Resource handlers for MCP server.
 * Handles listing and reading JIRA tickets and Confluence resources.
 */

import { AxiosInstance } from "axios";
import { ListResourcesRequestSchema, ReadResourceRequestSchema, ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";

/** Shape of a JIRA issue from the search API (fields we use for listing). */
interface JiraIssueListItem {
  key: string;
  fields: {
    summary?: string;
    status?: { name: string };
  };
}

/**
 * Register resource handlers with the MCP server.
 * 
 * @param server - MCP server instance
 * @param apiClient - Atlassian API client
 */
export function registerResourceHandlers(server: Server, apiClient: AxiosInstance): void {
  /**
   * Handler for listing available JIRA tickets as resources
   */
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    try {
      // Get recent JIRA tickets
      const response = await apiClient.get("/rest/api/3/search/jql", {
        params: {
          jql: "updated >= -30d ORDER BY created DESC",
          maxResults: 10,
          fields: "summary,status,created,updated",
        },
      });

      const tickets: JiraIssueListItem[] = response.data.issues ?? [];

      return {
        resources: [
          ...tickets.map((ticket) => ({
            uri: `jira://ticket/${ticket.key}`,
            mimeType: "application/json",
            name: `JIRA Ticket: ${ticket.key}`,
            description: `${ticket.fields.summary ?? ""} (${ticket.fields.status?.name ?? "Unknown"})`,
          })),
          {
            uri: "confluence://spaces",
            mimeType: "application/json",
            name: "Confluence Spaces",
            description: "List of available Confluence spaces",
          },
        ],
      };
    } catch (error) {
      console.error("Error listing resources:", error);
      return { resources: [] };
    }
  });

  /**
   * Handler for reading JIRA tickets and Confluence resources
   */
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    try {
      const uri = request.params.uri;
      
      // Handle JIRA ticket resources
      if (uri.startsWith("jira://ticket/")) {
        const ticketKey = uri.replace("jira://ticket/", "");
        const response = await apiClient.get(`/rest/api/3/issue/${ticketKey}`, {
          params: {
            fields: "summary,description,status,created,updated,assignee,reporter,priority,issuetype",
          },
        });

        return {
          contents: [{
            uri: request.params.uri,
            mimeType: "application/json",
            text: JSON.stringify(response.data, null, 2),
          }],
        };
      }
      
      // Handle Confluence spaces resource
      if (uri === "confluence://spaces") {
        const response = await apiClient.get("/wiki/rest/api/space", {
          params: {
            limit: 25,
          },
        });

        return {
          contents: [{
            uri: request.params.uri,
            mimeType: "application/json",
            text: JSON.stringify(response.data, null, 2),
          }],
        };
      }
      
      // Handle Confluence page resources
      if (uri.startsWith("confluence://page/")) {
        const pageId = uri.replace("confluence://page/", "");
        const response = await apiClient.get(`/wiki/rest/api/content/${pageId}`, {
          params: {
            expand: "body.storage,version,space",
          },
        });

        return {
          contents: [{
            uri: request.params.uri,
            mimeType: "application/json",
            text: JSON.stringify(response.data, null, 2),
          }],
        };
      }

      throw new McpError(
        ErrorCode.InvalidRequest,
        `Unsupported resource URI: ${uri}`
      );
    } catch (error) {
      console.error("Error reading resource:", error);
      if (error instanceof McpError) {
        throw error;
      }
      throw new McpError(
        ErrorCode.InternalError,
        `Atlassian API error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  });
}

