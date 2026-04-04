# Implementation Plan: Lyon Arabic Font Migration

## Overview

This implementation plan outlines the steps to migrate from legacy Arabic fonts to Lyon Arabic Text fonts. The migration is a CSS-focused refactoring task that involves updating font declarations, CSS variables, and utility classes in app/app.css. The plan includes automated tests to verify the migration is complete and correct.

## Tasks

- [ ] 1. Set up testing infrastructure
  - Create CSS parser utility for testing
  - Set up fast-check for property-based testing
  - Create test file structure
  - _Requirements: All (testing foundation)_

- [ ] 2. Replace @font-face declarations
  - [x] 2.1 Remove all legacy font @font-face declarations
    - Remove @font-face for "DecoType Thuluth"
    - Remove @font-face for "ArbFONTS Amiri" (both weights)
    - Remove @font-face for "Dialogue"
    - Remove @font-face for "Yakout"
    - _Requirements: 1.1, 5.5, 5.6_
  
  - [x] 2.2 Add Lyon Arabic Text @font-face declarations
    - Add @font-face for Lyon Arabic Text Regular (weight 400)
    - Add @font-face for Lyon Arabic Text RegularNo2 (weight 400)
    - Add @font-face for Lyon Arabic Text Semibold (weight 600)
    - Add @font-face for Lyon Arabic Text Bold (weight 700)
    - Add @font-face for Lyon Arabic Text Black (weight 900)
    - Use format("opentype") for all .otf files
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_
  
  - [ ]* 2.3 Write unit tests for @font-face declarations
    - Test that exactly 5 Lyon Arabic Text @font-face rules exist
    - Test that no legacy font @font-face rules exist
    - Test that each font-weight is correctly mapped
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_
  
  - [ ]* 2.4 Write property test for font declarations
    - **Property 2: Lyon Arabic Text Font Declarations**
    - **Validates: Requirements 1.3, 1.4, 1.5, 1.6, 1.7**
    - Test that all @font-face rules have valid font-weight and src values

- [ ] 3. Update CSS variables
  - [x] 3.1 Update Tailwind theme variables
    - Replace --font-sans with "Lyon Arabic Text" as first font
    - Replace --font-serif with "Lyon Arabic Text" as first font
    - Remove "Inter", "Dialogue", "Yakout" from theme variables
    - _Requirements: 2.3_
  
  - [x] 3.2 Update RTL CSS variables
    - Update --font-family-base to use "Lyon Arabic Text" first
    - Update --font-family-arabic to use "Lyon Arabic Text" first
    - Preserve system font fallbacks
    - _Requirements: 2.1, 2.2, 2.5_
  
  - [x] 3.3 Update body font-family
    - Set body font-family to "Lyon Arabic Text" as primary
    - Maintain system font fallbacks
    - _Requirements: 2.4_
  
  - [ ]* 3.4 Write unit tests for CSS variables
    - Test --font-family-base starts with "Lyon Arabic Text"
    - Test --font-family-arabic starts with "Lyon Arabic Text"
    - Test --font-sans and --font-serif contain "Lyon Arabic Text"
    - Test body font-family starts with "Lyon Arabic Text"
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [ ]* 3.5 Write property test for CSS variables
    - **Property 3: CSS Variable Font Stack Structure**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.5**
    - Test that all CSS variables have Lyon Arabic Text first and include fallbacks

- [ ] 4. Checkpoint - Verify font declarations and variables
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Migrate utility classes
  - [x] 5.1 Remove legacy utility classes
    - Remove .amiri-regular class
    - Remove .amiri-bold class
    - Remove .amiri-regular-italic class
    - Remove .amiri-bold-italic class
    - Remove .font-thuluth class
    - _Requirements: 3.5_
  
  - [x] 5.2 Create new Lyon utility classes
    - Create .lyon-regular with font-weight 400
    - Create .lyon-semibold with font-weight 600
    - Create .lyon-bold with font-weight 700
    - Create .lyon-black with font-weight 900
    - Set font-family to "Lyon Arabic Text" with serif fallback for all
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.6_
  
  - [ ]* 5.3 Write unit tests for utility classes
    - Test that old utility classes don't exist
    - Test that new utility classes exist with correct font-weight
    - Test that all new classes use "Lyon Arabic Text"
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
  
  - [ ]* 5.4 Write property test for utility classes
    - **Property 4: Utility Class Font Weight Mapping**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.6**
    - Test that all Lyon utility classes have correct font-family and weight mapping

- [ ] 6. Verify RTL support preservation
  - [x] 6.1 Verify RTL CSS rules
    - Confirm html[dir="rtl"] rules reference updated CSS variables
    - Verify .arabic-text class still exists
    - Verify .latin-numerals class is preserved
    - Verify .arabic-numerals class is preserved
    - _Requirements: 4.1, 4.3, 4.4_
  
  - [ ]* 6.2 Write unit tests for RTL support
    - Test that .arabic-text class exists
    - Test that .latin-numerals and .arabic-numerals classes exist
    - Test that html[dir="rtl"] rules use correct CSS variables
    - _Requirements: 4.1, 4.3, 4.4_

- [ ] 7. Verify font file existence
  - [x] 7.1 Check all Lyon Arabic Text font files exist
    - Verify Lyon Arabic Text Regular.otf exists in public/fonts/
    - Verify Lyon Arabic Text RegularNo2.otf exists in public/fonts/
    - Verify Lyon Arabic Text Semibold.otf exists in public/fonts/
    - Verify Lyon Arabic Text Bold.otf exists in public/fonts/
    - Verify Lyon Arabic Text Black.otf exists in public/fonts/
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [ ]* 7.2 Write property test for font file existence
    - **Property 5: Font File Existence**
    - **Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5**
    - Test that all referenced font files exist in filesystem

- [ ] 8. Comprehensive migration verification
  - [ ]* 8.1 Write property test for legacy font removal
    - **Property 1: Legacy Font Removal**
    - **Validates: Requirements 5.5, 5.6**
    - Test that no legacy font names appear anywhere in CSS file
  
  - [ ]* 8.2 Run all property-based tests
    - Execute all 5 property tests with 100+ iterations each
    - Verify all tests pass
    - _Requirements: All_

- [ ] 9. Final checkpoint - Manual testing
  - Ensure all automated tests pass
  - Perform manual visual verification in browser
  - Test RTL rendering with Arabic content
  - Verify font weights appear distinct
  - Test across different browsers (Chrome, Firefox, Safari)
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster implementation
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties across the entire CSS file
- Unit tests validate specific examples and concrete cases
- Manual testing is required for visual verification since font rendering cannot be fully automated
- The migration is CSS-only; no JavaScript or component changes are needed
- All font files already exist in public/fonts/ directory
