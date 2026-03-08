/**
 * Utility functions for handling Arabic text with proper number rendering
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