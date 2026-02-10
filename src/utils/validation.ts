/**
 * Parameter validation utilities for tool arguments.
 * Provides reusable validation functions with consistent error messages.
 */

import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";

/**
 * Require a string parameter, throwing if missing or empty.
 *
 * @param value - Value to validate
 * @param paramName - Name of the parameter for error messages
 * @returns The validated string value
 * @throws McpError if value is empty or missing
 */
export function requireString(value: unknown, paramName: string): string {
  const str = String(value || "");
  if (!str) {
    throw new McpError(ErrorCode.InvalidParams, `${paramName} is required`);
  }
  return str;
}

/**
 * Get an optional string parameter.
 *
 * @param value - Value to convert
 * @returns String value or undefined if empty/falsy
 */
export function optionalString(value: unknown): string | undefined {
  return value ? String(value) : undefined;
}

/**
 * Get a number with a default value.
 *
 * @param value - Value to convert
 * @param defaultValue - Default if value is undefined
 * @returns Number value or default
 */
export function numberWithDefault(value: unknown, defaultValue: number): number {
  return value !== undefined ? Number(value) : defaultValue;
}

/**
 * Require at least one of two parameters.
 *
 * @param value1 - First value option
 * @param name1 - Name of first parameter
 * @param value2 - Second value option
 * @param name2 - Name of second parameter
 * @returns The first non-empty value
 * @throws McpError if both values are empty
 */
export function requireEither(
  value1: unknown,
  name1: string,
  value2: unknown,
  name2: string
): string {
  const v1 = value1 ? String(value1) : undefined;
  const v2 = value2 ? String(value2) : undefined;

  if (!v1 && !v2) {
    throw new McpError(ErrorCode.InvalidParams, `Either ${name1} or ${name2} is required`);
  }

  return (v1 || v2)!;
}

/**
 * Require at least one field from an object to be provided.
 *
 * @param fields - Object containing field values
 * @param fieldNames - Array of field names to check
 * @throws McpError if no field has a value
 */
export function requireAtLeastOneField(
  fields: Record<string, unknown>,
  fieldNames: string[]
): void {
  const hasAtLeastOne = fieldNames.some((name) => fields[name] !== undefined);
  if (!hasAtLeastOne) {
    throw new McpError(
      ErrorCode.InvalidParams,
      `At least one of (${fieldNames.join(", ")}) must be provided`
    );
  }
}

/**
 * Validate and convert a boolean parameter.
 *
 * @param value - Value to convert
 * @param defaultValue - Default if value is undefined
 * @returns Boolean value
 */
export function booleanWithDefault(value: unknown, defaultValue: boolean): boolean {
  if (value === undefined) {
    return defaultValue;
  }
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  return Boolean(value);
}

/**
 * Validate an array parameter.
 *
 * @param value - Value to validate
 * @param paramName - Name of the parameter for error messages
 * @returns Array of strings
 */
export function requireArray(value: unknown, paramName: string): string[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new McpError(ErrorCode.InvalidParams, `${paramName} must be a non-empty array`);
  }
  return value.map((item) => String(item));
}

/**
 * Get an optional array parameter.
 *
 * @param value - Value to convert
 * @returns Array of strings or undefined
 */
export function optionalArray(value: unknown): string[] | undefined {
  if (!value) {
    return undefined;
  }
  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }
  // Handle comma-separated string
  if (typeof value === "string") {
    return value.split(",").map((item) => item.trim());
  }
  return undefined;
}
