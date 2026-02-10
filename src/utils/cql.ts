/**
 * Confluence Query Language (CQL) builder utilities.
 * Provides safe query building with proper escaping.
 *
 * @see https://developer.atlassian.com/server/confluence/advanced-searching-using-cql/
 */

/**
 * Escape a value for use in CQL queries.
 * Prevents CQL injection attacks by escaping special characters.
 *
 * @param value - Raw value to escape
 * @returns Escaped value safe for CQL queries
 */
export function escapeCqlValue(value: string): string {
  // Escape backslashes and double quotes
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/**
 * Build a text search CQL query.
 *
 * @param query - Search query text
 * @param spaceKey - Optional space key to filter by
 * @returns CQL query string
 */
export function buildTextSearchCql(query: string, spaceKey?: string): string {
  const escapedQuery = escapeCqlValue(query);
  let cql = `text ~ "${escapedQuery}"`;

  if (spaceKey) {
    const escapedSpace = escapeCqlValue(spaceKey);
    cql = `space = "${escapedSpace}" AND ${cql}`;
  }

  return cql;
}

/**
 * Build a label search CQL query.
 *
 * @param label - Label to search for
 * @returns CQL query string
 */
export function buildLabelSearchCql(label: string): string {
  return `label = "${escapeCqlValue(label)}"`;
}

/**
 * Build a space-filtered CQL query with custom condition.
 *
 * @param spaceKey - Space key to filter by
 * @param additionalCondition - Optional additional CQL condition
 * @returns CQL query string
 */
export function buildSpaceCql(spaceKey: string, additionalCondition?: string): string {
  const escapedSpace = escapeCqlValue(spaceKey);
  let cql = `space = "${escapedSpace}"`;

  if (additionalCondition) {
    cql = `${cql} AND ${additionalCondition}`;
  }

  return cql;
}

/**
 * Build a CQL query with type filter.
 *
 * @param type - Content type (page, blogpost, comment, etc.)
 * @param additionalCondition - Optional additional CQL condition
 * @returns CQL query string
 */
export function buildTypeCql(type: string, additionalCondition?: string): string {
  const escapedType = escapeCqlValue(type);
  let cql = `type = "${escapedType}"`;

  if (additionalCondition) {
    cql = `${cql} AND ${additionalCondition}`;
  }

  return cql;
}
