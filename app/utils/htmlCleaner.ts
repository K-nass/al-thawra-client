/**
 * Utility to clean HTML content received from the backend.
 * Specifically handles escaped characters and stringification artifacts.
 */
export function cleanHtml(html: string | undefined | null): string {
    if (!html) return "";

    return html
        // Handle double-escaped newlines and tabs
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "\r")
        .replace(/\\t/g, " ")
        // Remove backslashes before quotes
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        // Clean up any remaining double backslashes
        .replace(/\\\\/g, "\\")
        // Normalize whitespace (optional, but keeps DOM clean)
        .trim();
}
