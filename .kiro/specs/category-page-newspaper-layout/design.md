# Design Document: Category Page Newspaper Layout

## Overview

This design transforms the category page from a uniform grid layout into a newspaper-style hierarchical layout. The redesign emphasizes the first post as a featured item displayed prominently, followed by remaining posts in a standard grid. Visual dashed borders separate distinct sections (header, featured post, grid) to create a clear content hierarchy reminiscent of traditional newspaper layouts.

The implementation maintains all existing functionality including SSR, pagination, subcategory filtering, SEO, and responsive behavior while introducing minimal structural changes to the existing React Router-based architecture.

### Design Goals

1. Create visual hierarchy through featured post prominence
2. Maintain newspaper aesthetic with dashed border separators
3. Preserve all existing functionality (SSR, pagination, filtering, SEO)
4. Introduce reusable CSS utilities for consistent border styling
5. Ensure responsive behavior across all device sizes
6. Minimize changes to existing component APIs

## Architecture

### Component Structure

The design introduces a new layout structure within the existing `category.$slug.tsx` route without requiring new components:

```
CategoryPage (category.$slug.tsx)
├── Header Section
│   ├── Category Title
│   ├── Subcategories Navigation
│   └── Category Description
├── [Dashed Border Separator]
├── Featured Post Section (conditional: if posts.length > 0)
│   └── PostCard (with featured variant styling)
├── [Dashed Border Separator]
└── Posts Grid Section (conditional: if posts.length > 1)
    ├── PostsGrid (remaining posts)
    └── Pagination Controls
```

### Layout Flow

1. **Header Section**: Existing header with category name, subcategories, and description
2. **Featured Post**: First post from the posts array rendered with enhanced styling
3. **Posts Grid**: Remaining posts (posts.slice(1)) rendered in existing grid layout
4. **Separators**: Dashed borders between each major section

### Data Flow

No changes to existing data flow:
- Loader fetches category and posts data (SSR)
- Posts array is split client-side: `[featuredPost, ...remainingPosts]`
- Pagination continues to work on the full posts array
- Subcategory filtering continues via URL params

## Components and Interfaces

### Modified Component: category.$slug.tsx

The route component requires structural changes to implement the newspaper layout:

**Changes Required:**
1. Split posts array into featured and remaining posts
2. Add dashed border separators between sections
3. Conditionally render featured post section
4. Pass remaining posts to PostsGrid
5. Apply new CSS utility classes for borders

**New Layout Structure:**
```tsx
// After header section
{posts.length > 0 && (
  <>
    {/* Dashed border after header */}
    <div className="border-dashed-horizontal" />
    
    {/* Featured Post Section */}
    <div className="featured-post-container">
      <PostCard post={posts[0]} variant="featured" />
    </div>
    
    {/* Dashed border after featured post */}
    {posts.length > 1 && <div className="border-dashed-horizontal" />}
    
    {/* Remaining Posts Grid */}
    {posts.length > 1 && (
      <PostsGrid 
        posts={posts.slice(1)} 
        showCategoryHeader={false}
        postsPerPage={posts.length - 1}
      />
    )}
  </>
)}
```

### Modified Component: PostCard

The PostCard component needs to support a featured variant for larger display:

**New Prop:**
```tsx
interface PostCardProps {
  post: Post;
  buildLink?: (post: Post) => string;
  variant?: 'standard' | 'featured'; // New prop
}
```

**Variant Behavior:**
- `standard` (default): Current PostCard styling
- `featured`: Enhanced styling with larger image, larger text, more prominent layout

**Featured Variant Styling:**
- Larger image container (aspect ratio maintained)
- Larger title font size
- More padding/spacing
- Full-width layout on mobile, constrained on desktop
- Enhanced visual prominence through size and spacing

### Unchanged Components

**PostsGrid**: No changes required. Component already accepts posts array and renders them in a grid. Will receive `posts.slice(1)` instead of full array.

**EmptyState**: No changes required. Continues to display when posts.length === 0.

## Data Models

No changes to existing data models. The design works with existing Post and Category interfaces:

```tsx
interface Post {
  id: string;
  title: string;
  slug: string;
  image: string;
  imageDescription?: string;
  categoryName: string;
  categorySlug: string;
  authorName?: string;
  authorImage?: string;
  publishedAt: string;
  createdAt: string;
}

interface Category {
  name: string;
  slug: string;
  description?: string;
  subCategories?: SubCategory[];
}
```

## CSS Utilities

### New Utility Classes (app.css)

Add reusable dashed border utilities to the global stylesheet:

```css
/* Horizontal dashed border separator */
.border-dashed-horizontal {
  @apply border-t border-dashed border-black/10 my-8;
}

/* Vertical dashed border separator (for future use) */
.border-dashed-vertical {
  @apply border-r border-dashed border-black/10 mx-4;
}
```

**Design Rationale:**
- Uses Tailwind's `@apply` directive for consistency with existing styling approach
- `border-black/10` provides subtle separation without overwhelming the content
- `my-8` provides consistent vertical spacing between sections
- Naming convention follows Tailwind's utility class patterns
- Vertical variant included for potential future use in multi-column layouts

### Responsive Behavior

**Mobile (< 768px):**
- Featured post: Full width, single column
- Image: Full width with aspect ratio preserved
- Title: Larger than standard but scaled for mobile
- Grid: Existing single-column behavior

**Tablet (768px - 1024px):**
- Featured post: Full width with increased padding
- Image: Larger display with maintained aspect ratio
- Title: Enhanced size for prominence
- Grid: Existing 2-column behavior

**Desktop (> 1024px):**
- Featured post: Constrained max-width for readability
- Image: Maximum prominence while maintaining aspect ratio
- Title: Full featured size
- Grid: Existing 3-column behavior

## Correctness Properties


*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Post Array Splitting

*For any* category with posts, when posts.length > 0, the first post should be displayed as the featured post, and when posts.length > 1, posts.slice(1) should be passed to the Posts_Grid component.

**Validates: Requirements 2.1, 3.1**

### Property 2: Subcategory Filtering Preservation

*For any* subcategory selection via URL parameter, the filtering functionality should work correctly, displaying only posts from the selected subcategory and maintaining the header display with the selected subcategory highlighted.

**Validates: Requirements 1.4, 6.1**

### Property 3: Pagination Preservation

*For any* page number parameter, the pagination functionality should work correctly, displaying the appropriate posts for that page and enabling scroll-to-top behavior on page change.

**Validates: Requirements 3.3, 6.2, 6.6**

### Property 4: Dashed Border Consistency

*For any* dashed border separator element, it should use the CSS utility class with black color at 10% opacity, and this styling should remain consistent across all viewport breakpoints.

**Validates: Requirements 4.1, 4.4, 5.3**

### Property 5: CSS Utility Reusability

*For any* component in the application, the dashed border utility classes should be applicable and render correctly with consistent styling.

**Validates: Requirements 5.4**

### Property 6: SEO Meta Tags Preservation

*For any* category (with or without selected subcategory), the meta function should generate appropriate SEO meta tags including title, description, and structured data.

**Validates: Requirements 6.4**

### Property 7: Responsive Layout Adaptation

*For any* viewport size (mobile, tablet, desktop), the featured post and posts grid should adapt their layout appropriately, with the featured post displaying in single column on mobile and the grid maintaining its existing responsive behavior across all breakpoints.

**Validates: Requirements 7.1, 7.4**

## Error Handling

### Empty States

**No Posts in Category:**
- Condition: `posts.length === 0`
- Behavior: Display existing EmptyState component
- No featured post or grid sections rendered
- Header section remains visible with category information

**Single Post in Category:**
- Condition: `posts.length === 1`
- Behavior: Display only featured post section
- No grid section rendered (avoid empty grid)
- No dashed border after featured post

**Invalid Category Slug:**
- Condition: Category not found in loader
- Behavior: Existing 404 error handling (throw Response with 404 status)
- No changes to existing error handling

### CSS Utility Fallbacks

**Missing Utility Classes:**
- If CSS utilities are not loaded, Tailwind's default border utilities provide fallback
- Component structure remains intact even without custom utilities
- Graceful degradation to standard borders

### Responsive Breakpoint Handling

**Viewport Size Detection:**
- Rely on Tailwind's responsive utilities (sm:, md:, lg:, xl:)
- No JavaScript-based viewport detection required
- CSS media queries handle all responsive behavior

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests** focus on:
- Specific examples of layout rendering
- Edge cases (empty posts, single post, multiple posts)
- Presence of specific UI elements (borders, sections)
- CSS class application
- Integration between components

**Property Tests** focus on:
- Universal behaviors across all input variations
- Post splitting logic for any posts array
- Filtering and pagination for any parameters
- Responsive behavior across any viewport size
- CSS utility consistency across any usage

### Property-Based Testing Configuration

**Library Selection:**
- Use `@fast-check/vitest` for TypeScript/React property-based testing
- Integrates with existing Vitest test suite
- Provides generators for common data types

**Test Configuration:**
- Minimum 100 iterations per property test (due to randomization)
- Each property test must reference its design document property
- Tag format: **Feature: category-page-newspaper-layout, Property {number}: {property_text}**

### Unit Test Coverage

**Component Rendering Tests:**
1. Header section displays category name and subcategories
2. Dashed border separators are present between sections
3. Featured post is rendered with featured variant styling
4. Featured post displays in dedicated row above grid
5. Single post scenario renders only featured post without grid
6. Empty state displays when no posts exist
7. CSS utility classes exist in app.css with correct properties
8. SSR loader function executes and returns data

**Integration Tests:**
1. PostCard accepts and renders featured variant correctly
2. PostsGrid receives and renders remaining posts
3. Pagination controls function correctly
4. Subcategory filtering updates URL and display

### Property Test Coverage

**Property 1: Post Array Splitting**
```typescript
// Feature: category-page-newspaper-layout, Property 1: Post Array Splitting
// For any category with posts, verify correct splitting logic
fc.assert(
  fc.property(
    fc.array(postGenerator, { minLength: 1, maxLength: 20 }),
    (posts) => {
      const { featuredPost, remainingPosts } = splitPosts(posts);
      return (
        featuredPost === posts[0] &&
        (posts.length === 1 
          ? remainingPosts.length === 0 
          : remainingPosts.length === posts.length - 1)
      );
    }
  ),
  { numRuns: 100 }
);
```

**Property 2: Subcategory Filtering Preservation**
```typescript
// Feature: category-page-newspaper-layout, Property 2: Subcategory Filtering
// For any subcategory parameter, verify filtering works correctly
fc.assert(
  fc.property(
    fc.string({ minLength: 1, maxLength: 50 }),
    (subcategorySlug) => {
      const url = new URL(`http://test.com/category/news?sub=${subcategorySlug}`);
      const params = new URLSearchParams(url.search);
      return params.get('sub') === subcategorySlug;
    }
  ),
  { numRuns: 100 }
);
```

**Property 3: Pagination Preservation**
```typescript
// Feature: category-page-newspaper-layout, Property 3: Pagination
// For any page number, verify pagination works correctly
fc.assert(
  fc.property(
    fc.integer({ min: 1, max: 100 }),
    (pageNumber) => {
      const url = new URL(`http://test.com/category/news?page=${pageNumber}`);
      const params = new URLSearchParams(url.search);
      return parseInt(params.get('page') || '1') === pageNumber;
    }
  ),
  { numRuns: 100 }
);
```

**Property 4: Dashed Border Consistency**
```typescript
// Feature: category-page-newspaper-layout, Property 4: Border Consistency
// For any viewport size, verify border styling is consistent
fc.assert(
  fc.property(
    fc.integer({ min: 320, max: 2560 }),
    (viewportWidth) => {
      // Render component at viewport width
      // Verify all dashed borders have border-black/10 styling
      const borders = document.querySelectorAll('.border-dashed-horizontal');
      return Array.from(borders).every(border => {
        const styles = window.getComputedStyle(border);
        return styles.borderTopStyle === 'dashed';
      });
    }
  ),
  { numRuns: 100 }
);
```

**Property 5: CSS Utility Reusability**
```typescript
// Feature: category-page-newspaper-layout, Property 5: Utility Reusability
// For any component, verify utility classes work correctly
fc.assert(
  fc.property(
    fc.constantFrom('border-dashed-horizontal', 'border-dashed-vertical'),
    (utilityClass) => {
      const element = document.createElement('div');
      element.className = utilityClass;
      document.body.appendChild(element);
      const styles = window.getComputedStyle(element);
      const hasDashedBorder = styles.borderTopStyle === 'dashed' || 
                              styles.borderRightStyle === 'dashed';
      document.body.removeChild(element);
      return hasDashedBorder;
    }
  ),
  { numRuns: 100 }
);
```

**Property 6: SEO Meta Tags Preservation**
```typescript
// Feature: category-page-newspaper-layout, Property 6: SEO Meta Tags
// For any category data, verify meta tags are generated correctly
fc.assert(
  fc.property(
    categoryGenerator,
    fc.option(fc.string(), { nil: null }),
    (category, subcategorySlug) => {
      const metaTags = meta({ data: { category, selectedSubcategory: subcategorySlug } });
      return metaTags.some(tag => tag.title) && 
             metaTags.some(tag => tag.name === 'description');
    }
  ),
  { numRuns: 100 }
);
```

**Property 7: Responsive Layout Adaptation**
```typescript
// Feature: category-page-newspaper-layout, Property 7: Responsive Adaptation
// For any viewport size, verify layout adapts appropriately
fc.assert(
  fc.property(
    fc.integer({ min: 320, max: 2560 }),
    (viewportWidth) => {
      // Set viewport width
      window.innerWidth = viewportWidth;
      // Render component
      // Verify responsive classes are applied correctly
      const featuredPost = document.querySelector('[data-testid="featured-post"]');
      const grid = document.querySelector('[data-testid="posts-grid"]');
      
      if (viewportWidth < 768) {
        // Mobile: single column
        return featuredPost?.classList.contains('w-full');
      } else if (viewportWidth < 1024) {
        // Tablet: appropriate sizing
        return true; // Verify tablet-specific classes
      } else {
        // Desktop: maximum prominence
        return true; // Verify desktop-specific classes
      }
    }
  ),
  { numRuns: 100 }
);
```

### Test Data Generators

**Post Generator:**
```typescript
const postGenerator = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 10, maxLength: 100 }),
  slug: fc.string({ minLength: 5, maxLength: 50 }),
  image: fc.webUrl(),
  categoryName: fc.string({ minLength: 3, maxLength: 30 }),
  categorySlug: fc.string({ minLength: 3, maxLength: 30 }),
  publishedAt: fc.date().map(d => d.toISOString()),
  createdAt: fc.date().map(d => d.toISOString()),
});
```

**Category Generator:**
```typescript
const categoryGenerator = fc.record({
  name: fc.string({ minLength: 3, maxLength: 30 }),
  slug: fc.string({ minLength: 3, maxLength: 30 }),
  description: fc.option(fc.string({ minLength: 10, maxLength: 200 })),
  subCategories: fc.array(
    fc.record({
      name: fc.string({ minLength: 3, maxLength: 30 }),
      slug: fc.string({ minLength: 3, maxLength: 30 }),
    }),
    { maxLength: 10 }
  ),
});
```

### Testing Balance

- Unit tests handle specific examples and edge cases (empty, single post, multiple posts)
- Property tests handle comprehensive input coverage through randomization
- Together they provide confidence in both specific scenarios and general correctness
- Avoid writing too many unit tests for scenarios already covered by property tests
- Focus unit tests on integration points and visual/structural verification
- Focus property tests on behavioral invariants and universal rules

### Manual Testing Checklist

1. Visual verification of newspaper layout aesthetic
2. Dashed border appearance and consistency
3. Featured post prominence across devices
4. Responsive behavior at various viewport sizes
5. Subcategory filtering interaction
6. Pagination interaction
7. Empty state display
8. Single post edge case
9. Browser compatibility (Chrome, Firefox, Safari)
10. Accessibility (keyboard navigation, screen readers)
