/**
 * JQL (Jira Query Language) validation utilities.
 * Ensures JQL queries are valid before sending to the API.
 */

/**
 * Validates and fixes JQL queries to ensure they have a valid WHERE clause.
 * If a query starts with "ORDER BY" without a WHERE clause, prepends a default condition.
 * 
 * @param jql - The JQL query string to validate
 * @returns A valid JQL query string
 */
export function validateAndFixJQL(jql: string): string {
  const trimmedJql = jql.trim();
  
  // Check if query starts with "ORDER BY" (case-insensitive)
  // This indicates an invalid JQL query that needs a WHERE clause
  if (/^\s*ORDER\s+BY/i.test(trimmedJql)) {
    // Prepend a default WHERE clause to make it valid
    // Using "updated >= -30d" to get recently updated issues
    return `updated >= -30d ${trimmedJql}`;
  }
  
  return trimmedJql;
}

