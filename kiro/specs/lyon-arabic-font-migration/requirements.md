# Requirements Document

## Introduction

This document specifies the requirements for migrating from legacy Arabic fonts (ArbFONTS Amiri, DecoType Thuluth, Dialogue, Yakout) to the new Lyon Arabic Text font family in a React Router application with RTL (Right-to-Left) Arabic content support. The migration ensures consistent typography, maintains RTL functionality, and provides proper font-weight mapping across all components.

## Glossary

- **Font_Migration_System**: The system responsible for replacing old font declarations and references with new Lyon Arabic Text fonts
- **RTL_Handler**: The component that manages Right-to-Left text rendering for Arabic content
- **Font_Declaration**: CSS @font-face rules that define font families and their sources
- **CSS_Variable**: Custom CSS properties (--font-family-base, --font-family-arabic) used for font family references
- **Utility_Class**: CSS classes (.amiri-regular, .font-thuluth, etc.) that apply specific font styles
- **Lyon_Arabic_Text**: The new font family with five weight variants (Regular, RegularNo2, Semibold, Bold, Black)
- **Legacy_Fonts**: The old fonts being removed (ArbFONTS Amiri, DecoType Thuluth, Dialogue, Yakout)
- **Font_Weight_Mapping**: The correspondence between font variant names and CSS font-weight values

## Requirements

### Requirement 1: Font Declaration Replacement

**User Story:** As a developer, I want to replace all legacy font @font-face declarations with Lyon Arabic Text fonts, so that the application uses the new typography system.

#### Acceptance Criteria

1. WHEN the Font_Migration_System processes app.css, THE Font_Migration_System SHALL remove all @font-face declarations for Legacy_Fonts
2. WHEN the Font_Migration_System adds Lyon Arabic Text fonts, THE Font_Migration_System SHALL create @font-face declarations for all five weight variants
3. WHEN defining Lyon Arabic Text Regular, THE Font_Migration_System SHALL set font-weight to 400
4. WHEN defining Lyon Arabic Text Semibold, THE Font_Migration_System SHALL set font-weight to 600
5. WHEN defining Lyon Arabic Text Bold, THE Font_Migration_System SHALL set font-weight to 700
6. WHEN defining Lyon Arabic Text Black, THE Font_Migration_System SHALL set font-weight to 900
7. WHEN referencing font files, THE Font_Migration_System SHALL use the correct .otf file paths from /fonts/ directory

### Requirement 2: CSS Variable Updates

**User Story:** As a developer, I want CSS variables to reference Lyon Arabic Text as the primary font, so that all components inherit the new typography automatically.

#### Acceptance Criteria

1. WHEN updating --font-family-base, THE Font_Migration_System SHALL set "Lyon Arabic Text" as the first font in the fallback chain
2. WHEN updating --font-family-arabic, THE Font_Migration_System SHALL set "Lyon Arabic Text" as the first font in the fallback chain
3. WHEN updating Tailwind theme variables, THE Font_Migration_System SHALL replace Legacy_Fonts with "Lyon Arabic Text" in --font-sans and --font-serif
4. WHEN updating body font-family, THE Font_Migration_System SHALL set "Lyon Arabic Text" as the primary font
5. WHEN preserving fallback fonts, THE Font_Migration_System SHALL maintain system font fallbacks after Lyon Arabic Text

### Requirement 3: Utility Class Migration

**User Story:** As a developer, I want new utility classes for Lyon Arabic Text weight variants, so that I can apply specific font weights consistently across components.

#### Acceptance Criteria

1. WHEN creating utility classes, THE Font_Migration_System SHALL create .lyon-regular class with font-weight 400
2. WHEN creating utility classes, THE Font_Migration_System SHALL create .lyon-semibold class with font-weight 600
3. WHEN creating utility classes, THE Font_Migration_System SHALL create .lyon-bold class with font-weight 700
4. WHEN creating utility classes, THE Font_Migration_System SHALL create .lyon-black class with font-weight 900
5. WHEN removing old utility classes, THE Font_Migration_System SHALL remove .amiri-regular, .amiri-bold, .amiri-regular-italic, .amiri-bold-italic, and .font-thuluth classes
6. WHEN defining utility classes, THE Font_Migration_System SHALL set font-family to "Lyon Arabic Text" with serif fallback

### Requirement 4: RTL Support Preservation

**User Story:** As a user viewing Arabic content, I want RTL text rendering to continue working correctly with the new fonts, so that Arabic text displays properly.

#### Acceptance Criteria

1. WHEN html[dir="rtl"] is active, THE RTL_Handler SHALL apply Lyon Arabic Text as the primary font
2. WHEN rendering Arabic text, THE RTL_Handler SHALL maintain proper right-to-left text flow
3. WHEN applying fonts to RTL content, THE RTL_Handler SHALL preserve the .arabic-text class functionality
4. WHEN handling numerals in RTL context, THE RTL_Handler SHALL maintain .latin-numerals and .arabic-numerals class behavior

### Requirement 5: Legacy Font Reference Removal

**User Story:** As a developer, I want all references to legacy fonts removed from the codebase, so that the migration is complete and consistent.

#### Acceptance Criteria

1. WHEN scanning CSS files, THE Font_Migration_System SHALL identify all references to "ArbFONTS Amiri"
2. WHEN scanning CSS files, THE Font_Migration_System SHALL identify all references to "DecoType Thuluth"
3. WHEN scanning CSS files, THE Font_Migration_System SHALL identify all references to "Dialogue"
4. WHEN scanning CSS files, THE Font_Migration_System SHALL identify all references to "Yakout"
5. WHEN replacing font references, THE Font_Migration_System SHALL replace all Legacy_Fonts with "Lyon Arabic Text"
6. WHEN the migration is complete, THE Font_Migration_System SHALL ensure no Legacy_Fonts remain in CSS files

### Requirement 6: Font Weight Consistency

**User Story:** As a developer, I want consistent font-weight values mapped to Lyon Arabic Text variants, so that typography is predictable and maintainable.

#### Acceptance Criteria

1. WHEN applying font-weight 400, THE Font_Migration_System SHALL use Lyon Arabic Text Regular
2. WHEN applying font-weight 600, THE Font_Migration_System SHALL use Lyon Arabic Text Semibold
3. WHEN applying font-weight 700, THE Font_Migration_System SHALL use Lyon Arabic Text Bold
4. WHEN applying font-weight 900, THE Font_Migration_System SHALL use Lyon Arabic Text Black
5. WHEN font-weight values between defined weights are used, THE Font_Migration_System SHALL allow browser to interpolate to nearest defined weight

### Requirement 7: Component Compatibility Verification

**User Story:** As a developer, I want to verify that the new fonts render correctly across all components, so that no visual regressions occur.

#### Acceptance Criteria

1. WHEN rendering post content, THE Font_Migration_System SHALL display text using Lyon Arabic Text
2. WHEN rendering reel content, THE Font_Migration_System SHALL display text using Lyon Arabic Text
3. WHEN rendering magazine viewer content, THE Font_Migration_System SHALL display text using Lyon Arabic Text
4. WHEN rendering navigation elements, THE Font_Migration_System SHALL display text using Lyon Arabic Text
5. WHEN rendering any RTL content, THE Font_Migration_System SHALL maintain proper Arabic text shaping and ligatures

### Requirement 8: Font File Validation

**User Story:** As a developer, I want to ensure all Lyon Arabic Text font files are properly loaded, so that the application doesn't have missing font errors.

#### Acceptance Criteria

1. WHEN the application loads, THE Font_Migration_System SHALL verify Lyon Arabic Text Regular.otf exists in /fonts/
2. WHEN the application loads, THE Font_Migration_System SHALL verify Lyon Arabic Text RegularNo2.otf exists in /fonts/
3. WHEN the application loads, THE Font_Migration_System SHALL verify Lyon Arabic Text Semibold.otf exists in /fonts/
4. WHEN the application loads, THE Font_Migration_System SHALL verify Lyon Arabic Text Bold.otf exists in /fonts/
5. WHEN the application loads, THE Font_Migration_System SHALL verify Lyon Arabic Text Black.otf exists in /fonts/
6. WHEN a font file is missing, THE Font_Migration_System SHALL fall back to system fonts gracefully
