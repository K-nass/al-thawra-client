# Implementation Plan: Layout2 Component

## Overview

This plan implements the Layout2 newspaper-style layout component with a two-row grid structure: 4 articles in the first row, and 3 articles plus a collapsible briefings subscription section in the second row. The implementation follows Layout1's visual design language (colors, typography, spacing) while introducing new layout patterns. The component will be built with TypeScript/React, using Tailwind CSS for responsive design and supporting Arabic RTL text direction.

## Tasks

- [x] 1. Set up Layout2 component structure and TypeScript interfaces
  - Create `app/layouts/Layout2.tsx` file
  - Define `Layout2Props` interface with `posts: Post[]` prop
  - Import `Post` type from `app/services/postsService`
  - Import React and React Router dependencies (Link component)
  - Create default export function component with proper TypeScript typing
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 2. Implement first row article grid (4 columns)
  - [x] 2.1 Create first row container with responsive grid layout
    - Implement grid container with Tailwind classes: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`
    - Slice posts array to get first 4 items: `posts.slice(0, 4)`
    - Apply consistent spacing and minimum height constraints
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6_

  - [x] 2.2 Implement article card rendering for first row
    - Map over first 4 posts and render article cards
    - Wrap each card in React Router Link component with correct path format
    - Display post image with conditional rendering and lazy loading
    - Display post category name with conditional rendering
    - Display post title as clickable heading
    - Display post description with conditional rendering
    - Apply hover effects (text-blue-700 transition-colors)
    - Use post.id as React key for each mapped item
    - _Requirements: 2.4, 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 3. Implement second row layout structure (3 articles + subscription)
  - [x] 3.1 Create second row container with responsive grid layout
    - Implement grid container with Tailwind classes: `grid grid-cols-1 lg:grid-cols-4 gap-4`
    - Slice posts array to get items 5-7: `posts.slice(4, 7)`
    - Add conditional rendering: only show if posts.length >= 5
    - Apply consistent spacing matching first row
    - _Requirements: 3.1, 3.2, 3.3, 7.2, 7.3, 7.4_

  - [x] 3.2 Implement article cards for second row (3 columns)
    - Map over posts 5-7 and render article cards
    - Use same article card structure as first row for consistency
    - Apply lg:col-span-3 to article grid container
    - Ensure articles stack vertically on mobile
    - _Requirements: 3.4, 3.5_

- [ ] 4. Implement collapsible briefings subscription section
  - [x] 4.1 Create briefings subscription component structure
    - Define `BriefingService` interface with id, name, description fields
    - Create hardcoded services array with 6 Arabic service items
    - Add useState hook for isExpanded state (default: false)
    - Create subscription container with lg:col-span-1 for desktop layout
    - Apply background color #b8d4e0 matching Layout1 style
    - Add padding and spacing consistent with Layout1
    - _Requirements: 5.7, 11.1, 11.2, 11.3, 11.4, 11.5_

  - [x] 4.2 Implement collapsible service list rendering
    - Display section title "اشترك في نشراتنا الإخبارية"
    - Render service list using ul/ol structure
    - Conditionally slice services array: `services.slice(0, isExpanded ? services.length : 3)`
    - Display service name in strong tag and description in paragraph
    - Use service.id as React key for mapped items
    - Add data-testid="briefing-service" to service items
    - _Requirements: 5.1, 5.6, 11.6, 11.7_

  - [x] 4.3 Implement toggle button with accessibility
    - Create toggle button with onClick handler: `() => setIsExpanded(!isExpanded)`
    - Add aria-expanded attribute bound to isExpanded state
    - Add aria-label with Arabic text: expanded ? "إخفاء الخدمات" : "عرض جميع الخدمات"
    - Render up arrow SVG icon when expanded
    - Render down arrow SVG icon when collapsed
    - Apply smooth transition animations (transition-all duration-300)
    - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.8, 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 5. Implement visual styling consistency with Layout1
  - [x] 5.1 Apply Layout1 color scheme and styling patterns
    - Use #b8d4e0 accent color for subscription section background
    - Apply border-dashed border-black/10 for section separators
    - Use consistent typography classes: text-2xl, font-bold, text-sm, text-xs
    - Apply hover effects: hover:text-blue-700 transition-colors
    - Use consistent spacing: p-3, p-4, gap-3, gap-4, mb-3, mb-4
    - Apply minimum height constraints: min-h-[600px] md:min-h-[700px]
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 7.5, 7.6_

  - [x] 5.2 Implement responsive design across all breakpoints
    - Verify mobile layout (< md): single column, stacked content
    - Verify tablet layout (md): 2-column grids
    - Verify desktop layout (lg): 4-column first row, 4-column second row
    - Test that subscription section stacks below articles on mobile
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 6. Implement Arabic RTL support and accessibility
  - [x] 6.1 Add Arabic language and RTL support
    - Ensure proper RTL text direction for Arabic content
    - Verify Arabic text alignment (text-right where needed)
    - Test Arabic category names and titles render correctly
    - Handle mixed Arabic/English content properly
    - Add dir="rtl" attribute to form inputs if present
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 6.2 Implement accessibility attributes and features
    - Add alt attributes to all img elements (use post.title)
    - Add loading="lazy" to all img elements for performance
    - Ensure toggle button has proper aria-label and aria-expanded
    - Verify all interactive elements are keyboard accessible
    - Ensure sufficient color contrast (WCAG AA)
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 12.1_

- [ ] 7. Implement error handling and edge cases
  - [x] 7.1 Handle empty and insufficient data scenarios
    - Add empty state check: display "لا توجد مقالات متاحة" when posts array is empty
    - Handle posts.length < 4: display only available posts in first row
    - Handle posts.length < 7: conditionally render second row
    - Handle undefined/null posts prop: default to empty array
    - Handle missing post fields: conditional rendering for image, description, categoryName
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ] 8. Integration and final wiring
  - [x] 8.1 Verify integration with existing components
    - Confirm Post type compatibility with postsService
    - Verify React Router Link navigation works correctly
    - Verify Tailwind CSS classes render properly
    - Ensure no new dependencies are introduced
    - Verify component renders without errors in application context
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

  - [x] 8.2 Performance optimization
    - Verify lazy loading is applied to all images
    - Ensure no unnecessary re-renders occur
    - Check that component doesn't block main thread
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

## Notes

- Each task references specific requirements for traceability
- The component follows Layout1's design patterns for consistency
- All Arabic text is hardcoded in the component (no i18n needed for MVP)
- The briefings subscription services array is hardcoded with 6 items
- Component uses React hooks (useState) for state management
- Responsive design uses Tailwind CSS breakpoints (sm, md, lg, xl)
