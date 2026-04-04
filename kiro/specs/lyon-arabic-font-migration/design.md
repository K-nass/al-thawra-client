# Design Document: Lyon Arabic Font Migration

## Overview

This design outlines the approach for migrating from legacy Arabic fonts (ArbFONTS Amiri, DecoType Thuluth, Dialogue, Yakout) to the Lyon Arabic Text font family. The migration involves updating CSS font declarations, CSS variables, utility classes, and ensuring RTL (Right-to-Left) support remains intact. The design prioritizes minimal disruption to existing functionality while establishing a consistent typography system.

The migration is a straightforward CSS refactoring task that replaces font-family references and @font-face declarations. No JavaScript logic changes are required, and the existing RTL handling mechanisms remain unchanged.

## Architecture

### High-Level Structure

```
┌─────────────────────────────────────────┐
│         app/app.css                     │
│  ┌───────────────────────────────────┐  │
│  │   @font-face Declarations         │  │
│  │   - Lyon Arabic Text (5 weights)  │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │   CSS Variables                   │  │
│  │   - --font-family-base            │  │
│  │   - --font-family-arabic          │  │
│  │   - Tailwind theme vars           │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │   Utility Classes                 │  │
│  │   - .lyon-regular                 │  │
│  │   - .lyon-semibold                │  │
│  │   - .lyon-bold                    │  │
│  │   - .lyon-black                   │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │   RTL Handling                    │  │
│  │   - html[dir="rtl"] rules         │  │
│  │   - .arabic-text class            │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  React Components     │
        │  - Inherit fonts via  │
        │    CSS variables      │
        │  - Use utility classes│
        └───────────────────────┘
```

### Migration Strategy

The migration follows a **replace-in-place** strategy:
1. Remove old @font-face declarations
2. Add new Lyon Arabic Text @font-face declarations
3. Update CSS variable values
4. Replace utility class definitions
5. Update body and global font-family rules

This approach ensures zero downtime and immediate visual consistency once the CSS file is updated.

## Components and Interfaces

### 1. Font Declaration Module

**Location:** `app/app.css` (lines 4-31)

**Current State:**
```css
@font-face {
  font-family: "DecoType Thuluth";
  src: url("/fonts/decotype-thuluth-iii.ttf") format("truetype");
}

@font-face {
  font-family: "ArbFONTS Amiri";
  src: url("/fonts/ArbFONTS-Amiri.ttf") format("truetype");
  font-weight: 400;
}

@font-face {
  font-family: "ArbFONTS Amiri";
  src: url("/fonts/ArbFONTS-Amiri Bold.ttf") format("truetype");
  font-weight: 700;
}

@font-face {
  font-family: "Dialogue";
  src: url("/fonts/Dialogue-Variable-ME-Roman-TRIAL.ttf") format("truetype");
  font-weight: 100 900;
}

@font-face {
  font-family: "Yakout";
  src: url("/fonts/YakoutLinotypeLight-Regular.ttf") format("truetype");
}
```

**New State:**
```css
@font-face {
  font-family: "Lyon Arabic Text";
  src: url("/fonts/Lyon Arabic Text Regular.otf") format("opentype");
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: "Lyon Arabic Text";
  src: url("/fonts/Lyon Arabic Text RegularNo2.otf") format("opentype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Lyon Arabic Text";
  src: url("/fonts/Lyon Arabic Text Semibold.otf") format("opentype");
  font-weight: 600;
  font-style: normal;
}

@font-face {
  font-family: "Lyon Arabic Text";
  src: url("/fonts/Lyon Arabic Text Bold.otf") format("opentype");
  font-weight: 700;
  font-style: normal;
}

@font-face {
  font-family: "Lyon Arabic Text";
  src: url("/fonts/Lyon Arabic Text Black.otf") format("opentype");
  font-weight: 900;
  font-style: normal;
}
```

**Design Decisions:**
- Use `format("opentype")` for .otf files (correct MIME type)
- Define all five weights with explicit font-weight values
- Include `font-style: normal` for clarity
- Add `font-display: swap` to RegularNo2 variant for performance (optional fallback)
- Use the same font-family name "Lyon Arabic Text" for all weights (browser selects based on font-weight)

### 2. CSS Variables Module

**Location:** `app/app.css` (lines 33-42, 117-119)

**Current State:**
```css
@theme {
  --font-sans: "Inter", "Dialogue", "Yakout", ui-sans-serif, system-ui, sans-serif;
  --font-serif: "Inter", "ArbFONTS Amiri", "Amiri", ui-serif, Georgia, serif;
}

html[dir="rtl"] {
  --font-family-base: "ArbFONTS Amiri", "Dialogue", "Yakout", system-ui, ...;
  --font-family-arabic: "ArbFONTS Amiri", "Dialogue", "Yakout", "Noto Sans Arabic", ...;
}

body {
  font-family: "ArbFONTS Amiri", "Dialogue", "Yakout", system-ui, ...;
}
```

**New State:**
```css
@theme {
  --font-sans: "Lyon Arabic Text", ui-sans-serif, system-ui, sans-serif;
  --font-serif: "Lyon Arabic Text", ui-serif, Georgia, serif;
}

html[dir="rtl"] {
  --font-family-base: "Lyon Arabic Text", system-ui, -apple-system, "Segoe UI", "Roboto", "Helvetica Neue", Arial, "Noto Sans", sans-serif;
  --font-family-arabic: "Lyon Arabic Text", "Noto Sans Arabic", "Amiri", "Scheherazade New", system-ui, sans-serif;
}

body {
  background-color: #d0e8f2;
  font-family: "Lyon Arabic Text", system-ui, -apple-system, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;
}
```

**Design Decisions:**
- Remove "Inter" from Tailwind theme (not needed with Lyon Arabic Text)
- Place "Lyon Arabic Text" first in all fallback chains
- Preserve system font fallbacks for graceful degradation
- Keep "Noto Sans Arabic" and "Amiri" as fallbacks in --font-family-arabic for edge cases
- Maintain existing RTL handling structure

### 3. Utility Classes Module

**Location:** `app/app.css` (lines 75-102)

**Current State:**
```css
.amiri-regular {
  font-family: "ArbFONTS Amiri", serif;
  font-weight: 400;
}

.amiri-bold {
  font-family: "ArbFONTS Amiri", serif;
  font-weight: 700;
}

.amiri-regular-italic {
  font-family: "ArbFONTS Amiri", serif;
  font-weight: 400;
  font-style: italic;
}

.amiri-bold-italic {
  font-family: "ArbFONTS Amiri", serif;
  font-weight: 700;
  font-style: italic;
}

.font-thuluth {
  font-family: "DecoType Thuluth", serif;
  font-weight: normal;
  font-style: normal;
}
```

**New State:**
```css
.lyon-regular {
  font-family: "Lyon Arabic Text", serif;
  font-weight: 400;
}

.lyon-semibold {
  font-family: "Lyon Arabic Text", serif;
  font-weight: 600;
}

.lyon-bold {
  font-family: "Lyon Arabic Text", serif;
  font-weight: 700;
}

.lyon-black {
  font-family: "Lyon Arabic Text", serif;
  font-weight: 900;
}
```

**Design Decisions:**
- Remove italic variants (Lyon Arabic Text doesn't have italic styles)
- Remove .font-thuluth (decorative font no longer needed)
- Create four weight-based utility classes
- Use consistent naming pattern: .lyon-{weight}
- Maintain serif fallback for compatibility

### 4. RTL Handling Module

**Location:** `app/app.css` (lines 39-72)

**Current State:**
```css
html[dir="rtl"] {
  --font-family-base: "ArbFONTS Amiri", "Dialogue", "Yakout", ...;
  --font-family-arabic: "ArbFONTS Amiri", "Dialogue", "Yakout", ...;
}

html[dir="rtl"] body,
html[dir="rtl"] * {
  font-family: var(--font-family-arabic);
}

.arabic-text {
  font-family: var(--font-family-arabic);
}

.latin-numerals {
  font-family: system-ui, -apple-system, "Segoe UI", ...;
  unicode-bidi: embed;
  direction: ltr;
  display: inline-block;
  font-variant-numeric: lining-nums;
}

.arabic-numerals {
  font-family: var(--font-family-base);
  font-variant-numeric: lining-nums;
}
```

**New State:**
No structural changes needed. The RTL handling module will automatically use Lyon Arabic Text through the updated CSS variables. The existing classes (.arabic-text, .latin-numerals, .arabic-numerals) remain unchanged and continue to function correctly.

**Design Decisions:**
- Preserve all RTL-specific CSS rules
- Rely on CSS variable updates to propagate font changes
- Maintain numeral handling classes (critical for mixed Arabic/Latin content)
- Keep unicode-bidi and direction properties intact

## Data Models

### Font Weight Mapping

```typescript
type FontWeight = 400 | 600 | 700 | 900;

interface FontVariant {
  name: string;
  weight: FontWeight;
  filename: string;
}

const LYON_ARABIC_VARIANTS: FontVariant[] = [
  { name: "Regular", weight: 400, filename: "Lyon Arabic Text Regular.otf" },
  { name: "RegularNo2", weight: 400, filename: "Lyon Arabic Text RegularNo2.otf" },
  { name: "Semibold", weight: 600, filename: "Lyon Arabic Text Semibold.otf" },
  { name: "Bold", weight: 700, filename: "Lyon Arabic Text Bold.otf" },
  { name: "Black", weight: 900, filename: "Lyon Arabic Text Black.otf" }
];
```

### CSS Variable Schema

```typescript
interface CSSVariables {
  "--font-sans": string;           // Tailwind sans-serif stack
  "--font-serif": string;          // Tailwind serif stack
  "--font-family-base": string;    // Base font for RTL
  "--font-family-arabic": string;  // Arabic-specific font stack
}

const NEW_CSS_VARIABLES: CSSVariables = {
  "--font-sans": '"Lyon Arabic Text", ui-sans-serif, system-ui, sans-serif',
  "--font-serif": '"Lyon Arabic Text", ui-serif, Georgia, serif',
  "--font-family-base": '"Lyon Arabic Text", system-ui, -apple-system, "Segoe UI", "Roboto", "Helvetica Neue", Arial, "Noto Sans", sans-serif',
  "--font-family-arabic": '"Lyon Arabic Text", "Noto Sans Arabic", "Amiri", "Scheherazade New", system-ui, sans-serif'
};
```

### Utility Class Mapping

```typescript
interface UtilityClassMapping {
  oldClass: string;
  newClass: string;
  weight: FontWeight;
}

const CLASS_MIGRATIONS: UtilityClassMapping[] = [
  { oldClass: "amiri-regular", newClass: "lyon-regular", weight: 400 },
  { oldClass: "amiri-bold", newClass: "lyon-bold", weight: 700 },
  { oldClass: "font-thuluth", newClass: "lyon-bold", weight: 700 } // Map decorative to bold
];

// Note: .amiri-regular-italic and .amiri-bold-italic are removed (no italic in Lyon Arabic)
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Legacy Font Removal
*For any* CSS file after migration, no references to legacy font families ("ArbFONTS Amiri", "DecoType Thuluth", "Dialogue", "Yakout") should exist in any font-family declarations or @font-face rules.
**Validates: Requirements 5.5, 5.6**

### Property 2: Lyon Arabic Text Font Declarations
*For any* @font-face rule with font-family "Lyon Arabic Text", the font-weight value should be one of [400, 600, 700, 900] and the src URL should point to a valid .otf file in /fonts/ directory.
**Validates: Requirements 1.3, 1.4, 1.5, 1.6, 1.7**

### Property 3: CSS Variable Font Stack Structure
*For any* CSS variable (--font-family-base, --font-family-arabic, --font-sans, --font-serif), "Lyon Arabic Text" should be the first font in the fallback chain and system fonts should follow.
**Validates: Requirements 2.1, 2.2, 2.3, 2.5**

### Property 4: Utility Class Font Weight Mapping
*For any* Lyon utility class (.lyon-regular, .lyon-semibold, .lyon-bold, .lyon-black), the font-family should be "Lyon Arabic Text" and the font-weight should match the expected mapping (regular=400, semibold=600, bold=700, black=900).
**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.6**

### Property 5: Font File Existence
*For any* Lyon Arabic Text font variant referenced in @font-face rules, the corresponding .otf file should exist in the public/fonts/ directory.
**Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5**

## Error Handling

### Missing Font Files

**Scenario:** One or more Lyon Arabic Text .otf files are missing from public/fonts/

**Handling:**
- CSS font-family declarations include fallback fonts (system-ui, sans-serif, serif)
- Browser automatically falls back to next available font in the stack
- No JavaScript error handling needed (CSS handles gracefully)
- Console warning may appear in browser dev tools (browser behavior)

**Prevention:**
- Verify all five .otf files exist before deployment
- Include font file existence check in build process

### Invalid Font File Format

**Scenario:** Font file is corrupted or invalid

**Handling:**
- Browser skips invalid @font-face declaration
- Falls back to next font in font-family stack
- No application crash or error

**Prevention:**
- Validate font files during development
- Test font loading in multiple browsers

### CSS Parsing Errors

**Scenario:** Syntax error in updated CSS

**Handling:**
- Browser skips invalid CSS rules
- Valid rules continue to apply
- May result in incorrect font rendering

**Prevention:**
- Use CSS linter during development
- Test CSS changes in browser before deployment
- Validate CSS syntax with automated tools

### RTL Rendering Issues

**Scenario:** RTL text doesn't render correctly with new fonts

**Handling:**
- Fallback fonts in --font-family-arabic include "Noto Sans Arabic" and "Amiri"
- These fonts have proven RTL support
- System fonts provide final fallback

**Prevention:**
- Test RTL rendering in multiple browsers
- Verify Arabic text shaping and ligatures
- Check mixed LTR/RTL content rendering

## Testing Strategy

### Unit Testing Approach

The migration is primarily a CSS refactoring task, so testing focuses on verifying the CSS file structure and content rather than runtime behavior.

**Test Categories:**

1. **CSS Structure Tests** (Examples)
   - Verify all five Lyon Arabic Text @font-face declarations exist
   - Verify legacy font @font-face declarations are removed
   - Verify old utility classes (.amiri-regular, .font-thuluth) are removed
   - Verify new utility classes (.lyon-regular, .lyon-semibold, .lyon-bold, .lyon-black) exist

2. **CSS Content Tests** (Examples)
   - Verify body font-family starts with "Lyon Arabic Text"
   - Verify .arabic-text class still exists
   - Verify .latin-numerals and .arabic-numerals classes are preserved
   - Verify html[dir="rtl"] rules reference Lyon Arabic Text

3. **File System Tests** (Examples)
   - Verify Lyon Arabic Text Regular.otf exists
   - Verify Lyon Arabic Text Semibold.otf exists
   - Verify Lyon Arabic Text Bold.otf exists
   - Verify Lyon Arabic Text Black.otf exists
   - Verify Lyon Arabic Text RegularNo2.otf exists

4. **Property-Based Tests** (Properties)
   - Test that no legacy font names appear anywhere in CSS
   - Test that all CSS variables have Lyon Arabic Text as first font
   - Test that all @font-face src URLs are valid
   - Test that all utility classes have correct font-weight mappings

**Testing Tools:**
- CSS parser (e.g., PostCSS, css-tree) for parsing and analyzing CSS
- File system checks for font file existence
- String matching for legacy font name detection
- Property-based testing library (e.g., fast-check for TypeScript/JavaScript)

**Test Execution:**
- Run tests after CSS migration is complete
- Include tests in CI/CD pipeline
- Run tests before deployment

### Manual Testing Checklist

Since visual rendering cannot be fully automated, manual testing is required:

1. **Visual Verification**
   - [ ] Load application in browser
   - [ ] Verify Arabic text renders correctly
   - [ ] Check RTL text flow is correct
   - [ ] Verify font weights appear distinct (regular vs bold vs black)
   - [ ] Check mixed Arabic/Latin content renders properly

2. **Component Testing**
   - [ ] Test post content rendering
   - [ ] Test reel content rendering
   - [ ] Test magazine viewer rendering
   - [ ] Test navigation elements
   - [ ] Test any components using utility classes

3. **Browser Compatibility**
   - [ ] Test in Chrome/Edge
   - [ ] Test in Firefox
   - [ ] Test in Safari
   - [ ] Test on mobile browsers (iOS Safari, Chrome Mobile)

4. **RTL-Specific Testing**
   - [ ] Switch to Arabic language (dir="rtl")
   - [ ] Verify text alignment is correct
   - [ ] Check numeral rendering (.latin-numerals, .arabic-numerals)
   - [ ] Verify Arabic ligatures and text shaping

### Property-Based Test Configuration

**Library:** fast-check (for JavaScript/TypeScript projects)

**Configuration:**
- Minimum 100 iterations per property test
- Each test references its design document property
- Tag format: `Feature: lyon-arabic-font-migration, Property {number}: {property_text}`

**Example Test Structure:**
```typescript
import fc from 'fast-check';
import { parseCSS } from './css-parser';

// Feature: lyon-arabic-font-migration, Property 1: Legacy Font Removal
test('no legacy fonts remain in CSS', () => {
  fc.assert(
    fc.property(fc.constant(cssContent), (css) => {
      const parsed = parseCSS(css);
      const legacyFonts = ['ArbFONTS Amiri', 'DecoType Thuluth', 'Dialogue', 'Yakout'];
      
      for (const rule of parsed.rules) {
        if (rule.type === 'font-face' || rule.declarations?.some(d => d.property === 'font-family')) {
          const fontFamilyValue = getFontFamilyValue(rule);
          for (const legacyFont of legacyFonts) {
            expect(fontFamilyValue).not.toContain(legacyFont);
          }
        }
      }
    }),
    { numRuns: 100 }
  );
});
```

### Dual Testing Approach

This migration requires both unit tests and property tests:

- **Unit tests** verify specific examples (e.g., ".lyon-bold has font-weight 700")
- **Property tests** verify universal properties (e.g., "no legacy fonts exist anywhere")

Both are necessary for comprehensive coverage. Unit tests catch concrete bugs in specific declarations, while property tests verify the migration is complete across the entire CSS file.
