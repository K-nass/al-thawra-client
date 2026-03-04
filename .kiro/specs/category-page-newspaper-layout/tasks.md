# Implementation Plan: Category Page Newspaper Layout

## Overview

This implementation transforms the category page from a uniform grid layout into a newspaper-style hierarchical layout. The first post is displayed prominently as a featured item, followed by remaining posts in a standard grid. Dashed borders separate sections to create clear visual hierarchy. All existing functionality (SSR, pagination, filtering, SEO) is preserved.

## Tasks

- [x] 1. Add CSS utility classes for dashed borders
  - Add `.border-dashed-horizontal` utility class to `app/app.css`
  - Add `.border-dashed-vertical` utility class to `app/app.css`
  - Use `@apply` directive with `border-dashed border-black/10` styling
  - Include appropriate spacing (`my-8` for horizontal, `mx-4` for vertical)
  - _Requirements: 5.1, 5.2, 5.3, 5.5_

- [ ]* 1.1 Write unit tests for CSS utility classes
  - Test that utility classes exist in stylesheet
  - Test that classes apply correct border styles
  - Test that opacity is set to 10%
  - _Requirements: 5.3, 5.4_

- [x] 2. Enhance PostCard component with featured variant
  - [x] 2.1 Add `variant` prop to PostCard interface
    - Add optional `variant?: 'standard' | 'featured'` prop
    - Default to `'standard'` for backward compatibility
    - _Requirements: 2.2_

  - [x] 2.2 Implement featured variant styling
    - Add conditional styling based on variant prop
    - Increase image container size for featured variant
    - Increase title font size for featured variant
    - Add enhanced padding and spacing for featured variant
    - Ensure full-width layout on mobile, constrained on desktop
    - _Requirements: 2.2, 7.1, 7.3_

  - [ ]* 2.3 Write unit tests for PostCard variants
    - Test standard variant renders with default styling
    - Test featured variant renders with enhanced styling
    - Test variant prop defaults to standard
    - _Requirements: 2.2_

- [ ] 3. Checkpoint - Ensure component changes work correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implement newspaper layout in category.$slug.tsx
  - [x] 4.1 Add post array splitting logic
    - Split posts array: first post as featured, rest for grid
    - Handle edge case when `posts.length === 0` (show empty state)
    - Handle edge case when `posts.length === 1` (show only featured post)
    - _Requirements: 2.1, 2.5, 3.1_

  - [ ]* 4.2 Write property test for post array splitting
    - **Property 1: Post Array Splitting**
    - **Validates: Requirements 2.1, 3.1**
    - Test that for any posts array with length > 0, first post is featured
    - Test that for any posts array with length > 1, remaining posts go to grid
    - Use fast-check to generate arrays of varying lengths (1-20 posts)

  - [x] 4.3 Add dashed border separator after header section
    - Insert `<div className="border-dashed-horizontal" />` after header
    - Only render when `posts.length > 0`
    - _Requirements: 4.2_

  - [x] 4.4 Add featured post section
    - Render `<PostCard post={posts[0]} variant="featured" />` in dedicated container
    - Only render when `posts.length > 0`
    - Add appropriate container styling for layout
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 4.5 Add dashed border separator after featured post
    - Insert `<div className="border-dashed-horizontal" />` after featured post
    - Only render when `posts.length > 1`
    - _Requirements: 4.3_

  - [x] 4.6 Update posts grid to use remaining posts
    - Pass `posts.slice(1)` to PostsGrid component
    - Only render PostsGrid when `posts.length > 1`
    - Maintain existing PostsGrid props (showCategoryHeader, postsPerPage)
    - _Requirements: 3.1, 3.2_

  - [ ]* 4.7 Write unit tests for layout structure
    - Test header section displays category name and subcategories
    - Test dashed borders are present between sections
    - Test featured post renders with featured variant
    - Test single post scenario (no grid rendered)
    - Test empty state displays when no posts
    - Test PostsGrid receives correct remaining posts

- [ ] 5. Checkpoint - Ensure layout implementation is correct
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Verify existing functionality preservation
  - [ ]* 6.1 Write property test for subcategory filtering
    - **Property 2: Subcategory Filtering Preservation**
    - **Validates: Requirements 1.4, 6.1**
    - Test that for any subcategory slug parameter, filtering works correctly
    - Test that header displays selected subcategory highlighted
    - Use fast-check to generate subcategory slug strings

  - [ ]* 6.2 Write property test for pagination
    - **Property 3: Pagination Preservation**
    - **Validates: Requirements 3.3, 6.2, 6.6**
    - Test that for any page number parameter, pagination works correctly
    - Test that scroll-to-top behavior triggers on page change
    - Use fast-check to generate page numbers (1-100)

  - [ ]* 6.3 Write property test for SEO meta tags
    - **Property 6: SEO Meta Tags Preservation**
    - **Validates: Requirements 6.4**
    - Test that for any category data, meta tags are generated correctly
    - Test with and without subcategory selection
    - Use fast-check to generate category objects

  - [ ]* 6.4 Write unit tests for SSR and integration
    - Test loader function executes and returns data
    - Test pagination controls function correctly
    - Test subcategory filtering updates URL and display

- [x] 7. Implement and verify responsive behavior
  - [x] 7.1 Add responsive styling to featured post
    - Mobile (< 768px): Full width, single column layout
    - Tablet (768px - 1024px): Full width with increased padding
    - Desktop (> 1024px): Constrained max-width for readability
    - Use Tailwind responsive utilities (sm:, md:, lg:, xl:)
    - _Requirements: 7.1, 7.2, 7.3_

  - [ ]* 7.2 Write property test for dashed border consistency
    - **Property 4: Dashed Border Consistency**
    - **Validates: Requirements 4.1, 4.4, 5.3**
    - Test that for any viewport size, border styling is consistent
    - Test that all borders use black color at 10% opacity
    - Use fast-check to generate viewport widths (320-2560)

  - [ ]* 7.3 Write property test for CSS utility reusability
    - **Property 5: CSS Utility Reusability**
    - **Validates: Requirements 5.4**
    - Test that utility classes work correctly in any component
    - Test both horizontal and vertical variants
    - Use fast-check to test different usage contexts

  - [ ]* 7.4 Write property test for responsive layout adaptation
    - **Property 7: Responsive Layout Adaptation**
    - **Validates: Requirements 7.1, 7.4**
    - Test that for any viewport size, layout adapts appropriately
    - Test mobile, tablet, and desktop breakpoints
    - Test that grid maintains existing responsive behavior
    - Use fast-check to generate viewport widths (320-2560)

- [ ] 8. Final checkpoint - Complete verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests use `@fast-check/vitest` with minimum 100 iterations
- All existing functionality (SSR, pagination, filtering, SEO) must be preserved
- Responsive behavior relies on Tailwind utilities, no JavaScript viewport detection needed
- CSS utilities follow Tailwind naming conventions for consistency
