/**
 * Utility functions for handling Arabic text with proper number rendering and content cleaning
 */

/**
 * Wraps numbers in Arabic text with proper CSS classes to ensure correct rendering
 * @param text - The Arabic text containing numbers
 * @returns HTML string with properly formatted numbers
 */
export function formatArabicTextWithNumbers(text: string): string {
  // Replace numbers with span elements that have proper CSS classes
  return text.replace(/(\d+(?:[.,]\d+)*)/g, '<span class="latin-numerals fix-numbers">$1</span>');
}

/**
 * Simple function to ensure numbers display correctly in Arabic context
 * Uses Unicode directional marks to force LTR for numbers
 * @param text - Text that may contain numbers
 * @returns Text with numbers wrapped in proper direction
 */
export function ensureLatinNumbers(text: string): string {
  // Use Left-to-Right Override (LRO) and Pop Directional Formatting (PDF)
  return text.replace(/(\d+(?:[.,]\d+)*)/g, '\u202D$1\u202C');
}

/**
 * React component wrapper for Arabic text with numbers
 * Note: This is just a type definition. Use the ArabicText component instead.
 */
export interface ArabicTextWithNumbersProps {
  children: string;
  className?: string;
}

/**
 * Quick fix function - apply this to any text that has number display issues
 */
export function quickFixNumbers(text: string): string {
  // Replace problematic symbols with actual numbers
  let fixed = text;
  
  // Common replacements for the strange symbols
  fixed = fixed.replace(/⚬⚬⚬/g, '200');
  fixed = fixed.replace(/⚬⚬\.⚬/g, '22.2');
  fixed = fixed.replace(/⚬/g, '0'); // fallback for single symbols
  
  return fixed;
}

/**
 * Comprehensive Arabic content cleaner for articles with encoding issues
 * @param content - Raw content from API that may have rn/rnrn issues
 * @returns Cleaned content ready for display
 */
export function cleanArabicArticleContent(content: string): string {
  if (!content) return "";

  let cleaned = content;

  // Step 1: Handle literal "rn" and "rnrn" patterns aggressively
  cleaned = cleaned
    // Handle various forms of rn patterns
    .replace(/rnrn/gi, "\n\n")
    .replace(/rn/gi, "\n")
    // Handle cases with spaces
    .replace(/\s*rn\s*rn\s*/gi, "\n\n")
    .replace(/\s*rn\s*/gi, "\n")
    // Handle mixed patterns
    .replace(/([^\s])rn([^\s])/gi, '$1\n$2')
    .replace(/([^\s])rnrn([^\s])/gi, '$1\n\n$2');

  // Step 2: Normalize all line breaks
  cleaned = cleaned
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");

  // Step 3: Convert to HTML breaks
  cleaned = cleaned
    .replace(/\n\n+/g, "<br><br>")
    .replace(/\n/g, "<br>");

  // Step 4: Clean up Arabic text issues
  cleaned = cleaned
    // Fix spacing around Arabic punctuation
    .replace(/\s+([،؛؟!])/g, '$1')
    .replace(/([،؛؟!])\s+/g, '$1 ')
    // Convert Arabic-Indic digits to Latin if needed
    .replace(/[٠-٩]/g, (match) => {
      const arabicToLatin = {'٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'};
      return arabicToLatin[match as keyof typeof arabicToLatin] || match;
    })
    // Clean up excessive whitespace
    .replace(/\s{3,}/g, ' ')
    .replace(/\s+<br>/g, '<br>')
    .replace(/<br>\s+/g, '<br>')
    // Clean up multiple consecutive breaks
    .replace(/(<br>\s*){3,}/g, "<br><br>")
    .replace(/(<br>){3,}/g, "<br><br>");

  return cleaned.trim();
}

/**
 * Clean plain text summaries for cards and meta tags
 * Removes literal "rnrn" and "rn" artifacts that appear as strange text
 * @param text - The raw summary or title
 * @returns Cleaned plain text
 */
export function cleanPlainText(text: string | null | undefined): string {
  if (!text) return "";

  return text
    // Remove rn sequences
    .replace(/rnrn/gi, " ")
    .replace(/rn/gi, " ")
    // Clean up excessive whitespace
    .replace(/\s+/g, " ")
    .trim();
}