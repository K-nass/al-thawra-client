import React from 'react';
import { TripleDiamond } from './TripleDiamond';
import './colored-title.css';

/**
 * Props for the ColoredTitle component
 */
export interface ColoredTitleProps {
  /** The complete title text to display */
  title: string;
  /** Number of words from the beginning to color (default: 1) */
  coloredWordsCount?: number;
  /** Color for the emphasized words (default: '#ed1d24') - accepts any valid CSS color */
  color?: string;
  /** Additional CSS classes to apply to the root element */
  className?: string;
}

/**
 * ColoredTitle Component
 * 
 * A reusable React component that displays titles with selective word coloring 
 * and an integrated TripleDiamond icon. The component splits the title into words,
 * applies color styling to the first N words, and positions the TripleDiamond inline.
 * 
 * @example
 * ```tsx
 * // Basic usage with default color (#ed1d24) and 2 colored words
 * <ColoredTitle title="Breaking News Today" coloredWordsCount={2} />
 * 
 * // Custom color
 * <ColoredTitle 
 *   title="Important Update" 
 *   coloredWordsCount={1}
 *   color="#0066cc"
 * />
 * 
 * // With custom className
 * <ColoredTitle 
 *   title="Section Title Here"
 *   coloredWordsCount={2}
 *   className="text-3xl font-bold"
 * />
 * ```
 * 
 * @accessibility
 * - Uses semantic h2 element for proper document structure
 * - Color is not the only means of conveying information
 * - Screen readers will read the full title naturally
 * - Ensure color contrast meets WCAG AA standards
 * 
 * @param props - Component props
 * @returns A rendered title with colored words and inline TripleDiamond icon
 */
export const ColoredTitle: React.FC<ColoredTitleProps> = ({
  title,
  coloredWordsCount = 1,
  color = '#ed1d24',
  className = '',
}) => {
  // Split title into words
  const words = title.split(/\s+/).filter(word => word.length > 0);
  
  // Determine split point (handle edge cases)
  const splitIndex = Math.max(0, Math.min(Math.floor(coloredWordsCount), words.length));
  
  // Separate colored and uncolored words
  const coloredWords = words.slice(0, splitIndex);
  const remainingWords = words.slice(splitIndex);
  
  // Render with inline TripleDiamond
  return (
    <h2 className={`colored-title`}>
      <TripleDiamond />
      {coloredWords.length > 0 && (
        <span style={{ color }}>{coloredWords.join(' ')}</span>
      )}
      {remainingWords.length > 0 && (
        <span>{coloredWords.length > 0 ? ' ' : ''}{remainingWords.join(' ')}</span>
      )}
    </h2>
  );
};

export default ColoredTitle;
