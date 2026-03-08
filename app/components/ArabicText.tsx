import React from 'react';
import { cleanArabicArticleContent } from '../utils/arabicTextUtils';

interface ArabicTextProps {
  children: string;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * Component for displaying Arabic text with properly formatted numbers and cleaned content
 * Uses a more robust approach to ensure numbers display correctly and handles rn/rnrn issues
 */
export function ArabicText({ 
  children, 
  className = "", 
  as = 'span' 
}: ArabicTextProps) {
  // Clean the text for Arabic content issues and format numbers
  const formatText = (text: string) => {
    // First clean Arabic content issues (rn/rnrn patterns)
    const cleaned = cleanArabicArticleContent(text);
    
    // Then replace any sequence of digits (including decimals, commas, etc.)
    return cleaned.replace(/(\d+(?:[.,]\d+)*)/g, '<span class="latin-numerals fix-numbers">$1</span>');
  };

  const Component = as;

  return (
    <Component 
      className={`arabic-text ${className}`}
      dangerouslySetInnerHTML={{ __html: formatText(children) }}
      dir="rtl"
      lang="ar"
    />
  );
}

export default ArabicText;