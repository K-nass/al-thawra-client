/**
 * Utility to clean HTML content received from the backend.
 * Specifically handles escaped characters, stringification artifacts, and Arabic text issues.
 */
export function cleanHtml(html: string | undefined | null): string {
    if (!html) return "";

    let cleaned = html;

    // First, handle escaped characters
    cleaned = cleaned
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "\r")
        .replace(/\\t/g, " ")
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        .replace(/\\\\/g, "\\");

    // Handle literal "rn" patterns that appear as strange text
    // These need to be handled BEFORE actual line break characters
    // More aggressive pattern matching for various forms
    cleaned = cleaned
        .replace(/rnrn/gi, "||DOUBLE_BREAK||")
        .replace(/rn/gi, "||SINGLE_BREAK||")
        // Handle cases where there might be spaces around rn
        .replace(/\s*rn\s*rn\s*/gi, "||DOUBLE_BREAK||")
        .replace(/\s*rn\s*/gi, "||SINGLE_BREAK||");

    // Handle actual line break characters
    cleaned = cleaned
        .replace(/\r\n\r\n/g, "||DOUBLE_BREAK||")
        .replace(/\r\n/g, "||SINGLE_BREAK||")
        .replace(/\n\n/g, "||DOUBLE_BREAK||")
        .replace(/\n/g, "||SINGLE_BREAK||");

    // Convert placeholders to HTML
    cleaned = cleaned
        .replace(/\|\|DOUBLE_BREAK\|\|/g, "<br><br>")
        .replace(/\|\|SINGLE_BREAK\|\|/g, "<br>");

    // Clean up multiple consecutive <br> tags and normalize
    cleaned = cleaned
        .replace(/(<br>\s*){3,}/g, "<br><br>")
        .replace(/(<br>){3,}/g, "<br><br>")
        .trim();

    // Additional Arabic text fixes
    cleaned = cleanArabicTextIssues(cleaned);

    return cleaned;
}

/**
 * Additional cleaning specifically for Arabic text issues
 */
function cleanArabicTextIssues(text: string): string {
    let cleaned = text;

    // Fix common encoding issues with Arabic text
    cleaned = cleaned
        // Remove any remaining literal rn patterns that might have been missed
        .replace(/([^\s])rn([^\s])/g, '$1<br>$2')
        .replace(/([^\s])rnrn([^\s])/g, '$1<br><br>$2')
        // Fix spacing issues around Arabic punctuation
        .replace(/\s+([،؛؟!])/g, '$1')
        .replace(/([،؛؟!])\s+/g, '$1 ')
        // Normalize Arabic numbers if they appear as strange characters
        .replace(/[٠-٩]/g, (match) => {
            const arabicToLatin = {'٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'};
            return arabicToLatin[match as keyof typeof arabicToLatin] || match;
        })
        // Clean up extra whitespace
        .replace(/\s{3,}/g, ' ')
        .replace(/\s+<br>/g, '<br>')
        .replace(/<br>\s+/g, '<br>');

    return cleaned;
}
