/**
 * Regular expressions for handling line breaks in article content
 */

// Regular expression for double Windows line endings (\r\n\r\n)
export const DOUBLE_CRLF_REGEX = /\r\n\r\n/g;

// Regular expression for single Windows line endings (\r\n)
export const SINGLE_CRLF_REGEX = /\r\n/g;

// Regular expression for double Unix line endings (\n\n)
export const DOUBLE_LF_REGEX = /\n\n/g;

// Regular expression for single Unix line endings (\n)
export const SINGLE_LF_REGEX = /\n/g;

// Regular expression for literal "rnrn" text (appears as strange characters)
export const LITERAL_RNRN_REGEX = /rnrn/g;

// Regular expression for literal "rn" text (appears as strange characters)
export const LITERAL_RN_REGEX = /rn/g;

// Regular expression for any double line break (covers both Windows and Unix)
export const ANY_DOUBLE_LINE_BREAK_REGEX = /(\r\n\r\n|\n\n|rnrn)/g;

// Regular expression for any single line break (covers both Windows and Unix)
export const ANY_SINGLE_LINE_BREAK_REGEX = /(\r\n|\n|rn)/g;

/**
 * Utility functions for converting line breaks to HTML
 */
export const lineBreakUtils = {
  /**
   * Convert double line breaks to double <br> tags
   */
  convertDoubleLineBreaks: (text: string): string => {
    return text.replace(ANY_DOUBLE_LINE_BREAK_REGEX, "<br><br>");
  },

  /**
   * Convert single line breaks to single <br> tags
   */
  convertSingleLineBreaks: (text: string): string => {
    return text.replace(ANY_SINGLE_LINE_BREAK_REGEX, "<br>");
  },

  /**
   * Convert all line breaks to HTML (handles literal rn/rnrn and actual line breaks)
   */
  convertAllLineBreaks: (text: string): string => {
    return text
      .replace(LITERAL_RNRN_REGEX, "<br><br>")
      .replace(LITERAL_RN_REGEX, "<br>")
      .replace(DOUBLE_CRLF_REGEX, "<br><br>")
      .replace(SINGLE_CRLF_REGEX, "<br>")
      .replace(DOUBLE_LF_REGEX, "<br><br>")
      .replace(SINGLE_LF_REGEX, "<br>");
  },

  /**
   * Remove all line breaks (including literal rn text)
   */
  removeAllLineBreaks: (text: string): string => {
    return text
      .replace(LITERAL_RNRN_REGEX, " ")
      .replace(LITERAL_RN_REGEX, " ")
      .replace(ANY_SINGLE_LINE_BREAK_REGEX, " ");
  },

  /**
   * Normalize line breaks to Unix format (\n)
   */
  normalizeToUnix: (text: string): string => {
    return text
      .replace(LITERAL_RNRN_REGEX, "\n\n")
      .replace(LITERAL_RN_REGEX, "\n")
      .replace(SINGLE_CRLF_REGEX, "\n");
  },

  /**
   * Normalize line breaks to Windows format (\r\n)
   */
  normalizeToWindows: (text: string): string => {
    return text
      .replace(LITERAL_RNRN_REGEX, "\r\n\r\n")
      .replace(LITERAL_RN_REGEX, "\r\n")
      .replace(SINGLE_LF_REGEX, "\r\n");
  },

  /**
   * Clean content specifically for Arabic text with line break issues
   */
  cleanArabicContent: (text: string): string => {
    return text
      // Handle literal rnrn and rn first
      .replace(LITERAL_RNRN_REGEX, "<br><br>")
      .replace(LITERAL_RN_REGEX, "<br>")
      // Then handle actual line breaks
      .replace(DOUBLE_CRLF_REGEX, "<br><br>")
      .replace(SINGLE_CRLF_REGEX, "<br>")
      .replace(DOUBLE_LF_REGEX, "<br><br>")
      .replace(SINGLE_LF_REGEX, "<br>")
      // Clean up multiple consecutive breaks
      .replace(/(<br>\s*){3,}/g, "<br><br>")
      .trim();
  }
};