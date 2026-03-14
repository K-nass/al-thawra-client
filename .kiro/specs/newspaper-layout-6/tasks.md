# Implementation Plan: Layout6 Component

## Overview

This plan implements Layout6, a newspaper-style layout component that displays articles in a two-row structure. The first row features 2 large articles with images, titles, and descriptions in a 2-column grid. The second row displays 4 smaller articles with titles and descriptions in a 4-column grid. The rows are separated by a dashed border. The component follows the established design patterns from Layout1, Layout2, and Layout3, using TypeScript, React Router, and Tailwind CSS for responsive design.

## Tasks

- [x] 1. Create Layout6 component file and basic structure
  - Create `app/layouts/Layout6.tsx` file
  - Define Layout6Props interface with posts array
  - Implement default export function Layout6
  - Add Post type import from postsService
  - Add Link import from react-router
  - Set up basic component structure with two main sections
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 2. Implement first row layout (2 featured articles)
  - [x] 2.1 Create first row container with 2-column grid
    - Implement grid layout with responsive breakpoints (md:grid-cols-2)
    - Slice posts array to get first 2 posts (posts.slice(0, 2))
    - Map over first 2 posts to render featured article cards
    - _Requirements: 2.1, 5.1, 5.2, 5.3, 5.4_
  
  - [x] 2.2 Implement featured article card structure
    - Wrap each article in Link component with group class
    - Construct article URL: `/posts/categories/${post.categorySlug}/articles/${post.slug}`
    - Create article element with semafor-card class
    - Add text content section with padding
    - Add image section with conditional rendering
    - Use post.id as React key
    - _Requirements: 2.2, 2.3, 6.1, 6.2, 6.3, 6.4, 7.4_
  
  - [x] 2.3 Add title and description rendering for featured articles
    - Render h3 with title, responsive font sizes (text-xl md:text-2xl)
    - Add hover effect (group-hover:text-blue-700)
    - Add transition classes for smooth hover
    - Conditionally render description paragraph
    - Apply line-clamp-3 for description truncation
    - _Requirements: 2.3, 2.4, 2.6, 7.2, 7.5_
  
  - [x] 2.4 Add image rendering with optimization
    - Conditionally render image only if post.image exists
    - Add loading="lazy" attribute
    - Add alt text using post.title
    - Apply object-cover class for proper cropping
    - Add hover scale effect (group-hover:scale-105)
    - Add transition-transform duration-300
    - _Requirements: 2.5, 8.1, 8.2, 8.3, 8.4, 9.3, 10.3_
  
- [x] 3. Implement dashed border separator
  - Add div with border-t, border-dashed, border-black/10 classes
  - Add vertical spacing (my-6 md:my-8)
  - Position between first and second row containers
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 4. Implement second row layout (4 grid articles)
  - [x] 4.1 Create second row container with 4-column grid
    - Implement grid layout with responsive breakpoints (md:grid-cols-2 lg:grid-cols-4)
    - Slice posts array to get posts 3-6 (posts.slice(2, 6))
    - Map over posts 3-6 to render grid article cards
    - _Requirements: 3.1, 5.1, 5.2, 5.3, 5.4_
  
  - [x] 4.2 Implement grid article card structure
    - Wrap each article in Link component with group class
    - Construct article URL: `/posts/categories/${post.categorySlug}/articles/${post.slug}`
    - Create article element with semafor-card class and padding
    - Use post.id as React key
    - _Requirements: 3.2, 6.1, 6.2, 6.3, 6.4, 7.4_
  
  - [x] 4.3 Add title and description rendering for grid articles
    - Render h3 with title, smaller responsive font sizes (text-sm md:text-base)
    - Add hover effect (group-hover:text-blue-700)
    - Add transition classes for smooth hover
    - Apply line-clamp-2 for title truncation
    - Conditionally render description paragraph
    - Apply line-clamp-2 for description truncation
    - Use smaller text sizes (text-xs md:text-sm)
    - _Requirements: 3.3, 3.4, 3.5, 7.2, 7.5_
  
- [x] 5. Implement empty state and partial data handling
  - [x] 5.1 Add empty state handling
    - Check if posts array is empty or undefined
    - Return null or empty state message when no posts
    - Use safePosts pattern: `const safePosts = posts || []`
    - _Requirements: 9.1, 9.2_
  
  - [x] 5.2 Add conditional rendering for partial data
    - Conditionally render first row only if safePosts.length >= 2
    - Conditionally render second row only if safePosts.length >= 3
    - Handle cases with 1 post (render single featured article)
    - Handle cases with 2-5 posts (render first row + partial second row)
    - _Requirements: 9.1_
  
- [x] 6. Add semantic HTML and accessibility attributes
  - Use semantic article elements for each article card
  - Use h3 elements for article titles
  - Ensure proper heading hierarchy
  - Verify color contrast meets WCAG standards
  - Ensure keyboard navigation works through standard link behavior
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

## Notes

- Each task references specific requirements for traceability
- The component follows the same patterns as Layout1, Layout2, and Layout3 for consistency
- All responsive breakpoints use Tailwind CSS (md:, lg:)
- The component uses the semafor-card class for article containers
- Images are only displayed in the first row (featured articles)
- The second row displays text-only articles in a compact grid format
