import { useEffect } from 'react';

/**
 * Client-side utility to fix Arabic number display issues
 * This runs after the page loads and replaces problematic symbols with actual numbers
 */

/**
 * Map of problematic symbols to their correct number equivalents
 */
const SYMBOL_TO_NUMBER_MAP: Record<string, string> = {
  '⚬': '0',
  '◯': '0',
  '○': '0',
  '●': '0',
  '⭕': '0',
  '🔴': '0',
  '🟠': '1',
  '🟡': '2',
  '🟢': '3',
  '🔵': '4',
  '🟣': '5',
  '🟤': '6',
  '⚫': '7',
  '⚪': '8',
  '🔘': '9',
};

/**
 * Common patterns that appear instead of numbers
 */
const PATTERN_REPLACEMENTS: Array<[RegExp, string]> = [
  [/⚬⚬⚬/g, '200'],
  [/⚬⚬\.⚬/g, '22.2'],
  [/⚬⚬/g, '20'],
  [/⚬\.⚬/g, '2.2'],
];

/**
 * Fix Arabic numbers in a text string
 */
export function fixArabicNumbersInText(text: string): string {
  let fixed = text;
  
  // Apply pattern replacements first
  for (const [pattern, replacement] of PATTERN_REPLACEMENTS) {
    fixed = fixed.replace(pattern, replacement);
  }
  
  // Replace individual symbols
  for (const [symbol, number] of Object.entries(SYMBOL_TO_NUMBER_MAP)) {
    fixed = fixed.replace(new RegExp(symbol, 'g'), number);
  }
  
  return fixed;
}

/**
 * Fix Arabic numbers in DOM elements
 */
export function fixArabicNumbersInDOM(): void {
  if (typeof window === 'undefined') return;
  
  // Get all text nodes in the document
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null
  );
  
  const textNodes: Text[] = [];
  let node: Node | null;
  
  while (node = walker.nextNode()) {
    if (node.nodeType === Node.TEXT_NODE) {
      textNodes.push(node as Text);
    }
  }
  
  // Fix text in each node
  textNodes.forEach(textNode => {
    const originalText = textNode.textContent || '';
    const fixedText = fixArabicNumbersInText(originalText);
    
    if (originalText !== fixedText) {
      textNode.textContent = fixedText;
    }
  });
}

/**
 * Initialize the fix - call this after page load
 */
export function initArabicNumbersFix(): void {
  if (typeof window === 'undefined') return;
  
  // Fix immediately
  fixArabicNumbersInDOM();
  
  // Set up observer for dynamic content
  const observer = new MutationObserver((mutations) => {
    let shouldFix = false;
    
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        shouldFix = true;
      }
    });
    
    if (shouldFix) {
      setTimeout(fixArabicNumbersInDOM, 100);
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

/**
 * React hook to fix numbers on component mount
 */
export function useArabicNumbersFix(): void {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      fixArabicNumbersInDOM();
    }
  }, []);
}