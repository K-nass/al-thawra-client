import React from 'react';

interface ArabicTextProps {
  children: string;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * Component for displaying Arabic text with properly formatted numbers
 * Uses a more robust approach to ensure numbers display correctly
 */
export function ArabicText({ 
  children, 
  className = "", 
  as = 'span' 
}: ArabicTextProps) {
  // More robust number replacement that handles various number formats
  const formatText = (text: string) => {
    // Replace any sequence of digits (including decimals, commas, etc.)
    return text.replace(/(\d+(?:[.,]\d+)*)/g, '<span class="latin-numerals fix-numbers">$1</span>');
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