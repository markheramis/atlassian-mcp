/**
 * Atlassian API client setup.
 * Creates and configures Axios instance with authentication and conditional logging.
 */

import axios, { AxiosInstance } from "axios";
import { Config } from "./config.js";

/**
 * Create an Axios instance with authentication headers.
 * Uses Basic authentication with the token as password and email as username.
 * Logging is controlled by the MCP_DEBUG environment variable.
 *
 * @param config - Configuration object containing base URL, email, and token
 * @returns Configured Axios instance
 */
export function createApiClient(config: Config): AxiosInstance {
  const debug = process.env.MCP_DEBUG === "true";

  const apiClient = axios.create({
    baseURL: config.atlassian.baseUrl,
    headers: {
      // Using API token as password with Basic auth (email:token)
      Authorization: `Basic ${Buffer.from(`${config.atlassian.email}:${config.atlassian.token}`).toString("base64")}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  // Only add request/response logging interceptors when debug mode is enabled
  if (debug) {
    apiClient.interceptors.request.use((request) => {
      console.error("Request:", {
        method: request.method,
        url: request.url,
        headers: {
          ...request.headers,
          Authorization: "Basic [REDACTED]", // Don't log the actual token
        },
        data: request.data,
      });
      return request;
    });

    apiClient.interceptors.response.use(
      (response) => {
        console.error("Response:", {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          data: response.data,
        });
        return response;
      },
      (error) => {
        console.error("Error:", {
          message: error.message,
          response: error.response
            ? {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data,
              }
            : "No response",
        });
        return Promise.reject(error);
      }
    );
  }

  return apiClient;
}

