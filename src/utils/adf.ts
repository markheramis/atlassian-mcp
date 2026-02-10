/**
 * Atlassian Document Format (ADF) builder utilities.
 * Used for creating structured content in Jira comments, descriptions, and worklogs.
 *
 * @see https://developer.atlassian.com/cloud/jira/platform/apis/document/structure/
 */

/**
 * Text content node in ADF.
 */
export interface AdfTextNode {
  type: "text";
  text: string;
}

/**
 * Paragraph content node in ADF.
 */
export interface AdfParagraph {
  type: "paragraph";
  content: AdfTextNode[];
}

/**
 * Root ADF document structure.
 */
export interface AdfDocument {
  type: "doc";
  version: 1;
  content: AdfParagraph[];
}

/**
 * Create a simple ADF document with a single paragraph.
 *
 * @param text - The text content to wrap in ADF format
 * @returns ADF document object
 */
export function createAdfDocument(text: string): AdfDocument {
  return {
    type: "doc",
    version: 1,
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text }]
      }
    ]
  };
}

/**
 * Create an ADF document with multiple paragraphs.
 *
 * @param lines - Array of text lines, each becomes a separate paragraph
 * @returns ADF document object
 */
export function createAdfDocumentMultiline(lines: string[]): AdfDocument {
  return {
    type: "doc",
    version: 1,
    content: lines.map((line) => ({
      type: "paragraph",
      content: [{ type: "text", text: line }]
    }))
  };
}

/**
 * Create an ADF document from text that may contain newlines.
 * Splits on newlines and creates separate paragraphs.
 *
 * @param text - Text content that may contain newlines
 * @returns ADF document object
 */
export function createAdfDocumentFromText(text: string): AdfDocument {
  const lines = text.split("\n").filter((line) => line.trim().length > 0);
  if (lines.length === 0) {
    return createAdfDocument(text);
  }
  return createAdfDocumentMultiline(lines);
}
