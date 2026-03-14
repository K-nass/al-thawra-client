# Requirements Document

## Introduction

Layout2 is a newspaper-style layout component for the Al-Thawra news application. It displays articles in a structured grid format with two rows: a 4-column article grid in the first row, and a 3-column article grid plus a collapsible briefings subscription section in the second row. The component maintains visual consistency with Layout1 using the same color scheme, styling patterns, and responsive design principles.

## Glossary

- **Layout2**: The newspaper-style layout component being implemented
- **Layout1**: The existing reference layout component at app/layouts/Layout1.tsx
- **Post**: Article data structure defined in postsService containing title, description, image, category, author, and metadata
- **Article_Grid**: A responsive grid container displaying Post cards in columns
- **Briefings_Subscription**: A collapsible UI section allowing users to subscribe to news briefings
- **Collapsible_Section**: An expandable/collapsible UI component with show/hide toggle functionality
- **RTL**: Right-to-left text direction for Arabic language support
- **Responsive_Design**: Layout adaptation across mobile, tablet, and desktop screen sizes

## Requirements

### Requirement 1: Layout2 Component Structure

**User Story:** As a developer, I want to create the Layout2 component with proper TypeScript interfaces, so that it can be integrated into the application with type safety.

#### Acceptance Criteria

1. THE Layout2 SHALL be created at app/layouts/Layout2.tsx
2. THE Layout2 SHALL accept a posts prop of type Post array
3. THE Layout2 SHALL export a default function component
4. THE Layout2 SHALL import the Post type from app/services/postsService
5. THE Layout2 SHALL use React and React Router for navigation

### Requirement 2: First Row Article Grid

**User Story:** As a user, I want to see 4 articles displayed in columns in the first row, so that I can browse multiple stories at once.

#### Acceptance Criteria

1. THE Article_Grid SHALL display 4 columns on desktop screens (lg breakpoint and above)
2. THE Article_Grid SHALL display 2 columns on tablet screens (md breakpoint)
3. THE Article_Grid SHALL display 1 column on mobile screens (below md breakpoint)
4. WHEN posts data contains at least 4 items, THE Article_Grid SHALL display the first 4 posts in the first row
5. THE Article_Grid SHALL use Tailwind CSS grid classes (grid, grid-cols-1, md:grid-cols-2, lg:grid-cols-4)
6. THE Article_Grid SHALL apply consistent gap spacing between columns (gap-4)

### Requirement 3: Second Row Layout Structure

**User Story:** As a user, I want to see 3 articles plus a subscription section in the second row, so that I can access more content and subscribe to briefings.

#### Acceptance Criteria

1. THE Layout2 SHALL render a second row with 4 columns on desktop screens
2. THE Layout2 SHALL allocate 3 columns for articles in the second row
3. THE Layout2 SHALL allocate 1 column for the Briefings_Subscription in the second row
4. WHEN posts data contains at least 7 items, THE Layout2 SHALL display posts 5-7 in the second row article columns
5. THE Layout2 SHALL display the second row as a single column on mobile screens with articles stacked above the subscription section

### Requirement 4: Article Card Display

**User Story:** As a user, I want each article to display its image, title, category, and description, so that I can understand the content before clicking.

#### Acceptance Criteria

1. WHEN a Post has an image property, THE Article_Grid SHALL display the image
2. THE Article_Grid SHALL display the Post title as a clickable link
3. WHEN a Post has a description property, THE Article_Grid SHALL display the description text
4. THE Article_Grid SHALL navigate to /posts/categories/{categorySlug}/articles/{slug} when a Post is clicked
5. THE Article_Grid SHALL apply hover effects on article links (text color change to blue-700)

### Requirement 5: Collapsible Briefings Subscription

**User Story:** As a user, I want to expand and collapse the briefings subscription section, so that I can control the amount of information displayed.

#### Acceptance Criteria

1. THE Briefings_Subscription SHALL display 3 service items by default
2. THE Briefings_Subscription SHALL include an expand/collapse toggle button
3. WHEN the toggle button is clicked and the section is collapsed, THE Briefings_Subscription SHALL expand to show all service items
4. WHEN the toggle button is clicked and the section is expanded, THE Briefings_Subscription SHALL collapse to show only 3 service items
5. THE Briefings_Subscription SHALL display an up arrow icon when expanded
6. THE Briefings_Subscription SHALL display a down arrow icon when collapsed
7. THE Briefings_Subscription SHALL use React useState hook to manage expanded/collapsed state
8. THE Briefings_Subscription SHALL apply smooth transition animations when expanding/collapsing

### Requirement 6: Visual Styling Consistency

**User Story:** As a user, I want Layout2 to match Layout1's visual style, so that the application maintains a consistent look and feel.

#### Acceptance Criteria

1. THE Layout2 SHALL use #b8d4e0 as the accent color for highlighted elements
2. THE Layout2 SHALL use border-dashed styling for section separators
3. THE Layout2 SHALL use border-black/10 for border colors
4. THE Layout2 SHALL apply the same typography classes as Layout1 (text-2xl, font-bold, text-sm, etc.)
5. THE Layout2 SHALL use consistent spacing classes (p-3, p-4, gap-3, gap-4, mb-3, mb-4)
6. THE Layout2 SHALL apply the same hover transition effects as Layout1 (transition-colors)

### Requirement 7: Responsive Design Implementation

**User Story:** As a user, I want Layout2 to work properly on mobile, tablet, and desktop devices, so that I can access content on any device.

#### Acceptance Criteria

1. THE Layout2 SHALL use Tailwind responsive breakpoints (sm, md, lg, xl)
2. WHILE viewing on mobile screens (below md breakpoint), THE Layout2 SHALL stack all content vertically
3. WHILE viewing on tablet screens (md breakpoint), THE Layout2 SHALL display 2-column grids
4. WHILE viewing on desktop screens (lg breakpoint and above), THE Layout2 SHALL display 4-column grids
5. 
THE Layout2 SHALL maintain minimum height constraints (min-h-[600px] on mobile, min-h-[700px] on desktop)
6. THE Layout2 SHALL apply appropriate padding and margins for each breakpoint

### Requirement 8: Arabic Language and RTL Support

**User Story:** As an Arabic-speaking user, I want Layout2 to properly display Arabic text with right-to-left direction, so that content is readable and culturally appropriate.

#### Acceptance Criteria

1. THE Layout2 SHALL support RTL text direction for Arabic content
2. THE Layout2 SHALL properly align Arabic text to the right
3. THE Layout2 SHALL render Arabic category names and titles correctly
4. THE Layout2 SHALL maintain proper text flow for mixed Arabic and English content
5. THE Layout2 SHALL apply dir="rtl" attribute where necessary for form inputs

### Requirement 9: Accessibility Implementation

**User Story:** As a user with accessibility needs, I want Layout2 to be keyboard navigable and screen reader friendly, so that I can access all content and functionality.

#### Acceptance Criteria

1. THE Briefings_Subscription toggle button SHALL include an aria-label attribute describing its function
2. THE Briefings_Subscription toggle button SHALL include an aria-expanded attribute reflecting its current state
3. WHEN the Briefings_Subscription is expanded, THE toggle button SHALL set aria-expanded to "true"
4. WHEN the Briefings_Subscription is collapsed, THE toggle button SHALL set aria-expanded to "false"
5. THE Layout2 SHALL ensure all interactive elements are keyboard accessible (focusable and activatable via Enter/Space)
6. THE Layout2 SHALL provide sufficient color contrast for text readability (WCAG AA minimum)
7. THE Layout2 SHALL include alt text for all images

### Requirement 10: Empty State Handling

**User Story:** As a user, I want to see appropriate messages when no articles are available, so that I understand why content is not displayed.

#### Acceptance Criteria

1. WHEN the posts array is empty, THE Article_Grid SHALL display a "لا توجد مقالات متاحة" (No articles available) message
2. WHEN the posts array has fewer than 4 items, THE Article_Grid SHALL display only the available posts in the first row
3. WHEN the posts array has fewer than 7 items, THE Layout2 SHALL not display the second row article grid
4. THE Layout2 SHALL handle undefined or null posts prop gracefully without crashing

### Requirement 11: Briefings Subscription Services Display

**User Story:** As a user, I want to see a list of available briefing services with descriptions, so that I can understand what I'm subscribing to.

#### Acceptance Criteria

1. THE Briefings_Subscription SHALL display a title "اشترك في نشراتنا الإخبارية" (Subscribe to our briefings)
2. THE Briefings_Subscription SHALL display at least 6 service items in the full list
3. THE Briefings_Subscription SHALL display each service with a name and description
4. THE Briefings_Subscription SHALL style service items with consistent spacing and typography
5. THE Briefings_Subscription SHALL use a list structure (ul/ol) for service items
6. WHEN collapsed, THE Briefings_Subscription SHALL show services 1-3
7. WHEN expanded, THE Briefings_Subscription SHALL show all services

### Requirement 12: Performance and Loading

**User Story:** As a user, I want Layout2 to load quickly and efficiently, so that I can access content without delays.

#### Acceptance Criteria

1. THE Layout2 SHALL use lazy loading for images (loading="lazy" attribute)
2. THE Layout2 SHALL avoid unnecessary re-renders when props don't change
3. THE Layout2 SHALL render efficiently with large posts arrays (50+ items)
4. THE Layout2 SHALL not block the main thread during rendering
5. THE Layout2 SHALL use optimized image formats and sizes where available

### Requirement 13: Integration with Existing Components

**User Story:** As a developer, I want Layout2 to integrate seamlessly with existing application components, so that it works within the current architecture.

#### Acceptance Criteria

1. THE Layout2 SHALL use the same Post type interface as Layout1
2. THE Layout2 SHALL be compatible with React Router Link component
3. THE Layout2 SHALL follow the same file structure conventions as Layout1
4. THE Layout2 SHALL use the same Tailwind CSS configuration as the rest of the application
5. THE Layout2 SHALL not introduce new dependencies beyond what Layout1 uses
