/**
 * User lookup utilities for Jira API.
 * Handles finding users by email, username, or account ID.
 */

import { AxiosInstance } from "axios";
import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";

/**
 * Look up a user's accountId by email address.
 *
 * @param apiClient - Atlassian API client
 * @param email - User email address
 * @returns User's account ID
 * @throws McpError if user not found
 */
export async function lookupUserByEmail(
  apiClient: AxiosInstance,
  email: string
): Promise<string> {
  const response = await apiClient.get("/rest/api/3/user/search", {
    params: { query: email }
  });

  const users = response.data || [];
  if (users.length === 0) {
    throw new McpError(ErrorCode.InvalidParams, `User with email "${email}" not found`);
  }

  return users[0].accountId;
}

/**
 * Look up a user's accountId by username.
 *
 * @param apiClient - Atlassian API client
 * @param username - Username to search for
 * @returns User's account ID
 * @throws McpError if user not found
 */
export async function lookupUserByUsername(
  apiClient: AxiosInstance,
  username: string
): Promise<string> {
  const response = await apiClient.get("/rest/api/3/user/search", {
    params: { query: username }
  });

  const users = response.data || [];
  if (users.length === 0) {
    throw new McpError(ErrorCode.InvalidParams, `User with username "${username}" not found`);
  }

  return users[0].accountId;
}

/**
 * Resolve an identifier (email or accountId) to an accountId.
 * If the identifier contains '@', it's treated as an email and looked up.
 * Otherwise, it's assumed to be an accountId and returned as-is.
 *
 * @param apiClient - Atlassian API client
 * @param identifier - Email address or account ID
 * @returns User's account ID
 */
export async function resolveUserToAccountId(
  apiClient: AxiosInstance,
  identifier: string
): Promise<string> {
  // If it looks like an email, look it up
  if (identifier.includes("@")) {
    return lookupUserByEmail(apiClient, identifier);
  }
  // Otherwise assume it's already an accountId
  return identifier;
}
