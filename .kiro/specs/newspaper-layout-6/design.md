# Design Document: Layout6 Component

## Overview

Layout6 is a newspaper-style layout component that displays articles in a two-row structure optimized for showcasing featured content. The component follows the visual design language established by Layout1, Layout2, and Layout3, using the same color palette (#b8d4e0 accent color, #d0e8f2 background), typography, and responsive patterns while introducing a new layout structure specifically designed for highlighting featured articles with images followed by a compact grid of additional content.

The component serves as a content presentation module within the Al-Thawra news application, providing users with an organized view of up to 6 articles in a visually distinct format. Layout6 integrates seamlessly with the existing React Router navigation system and uses the established Post data structure from the postsService.

Key design goals:
- Maintain visual consistency with Layout1, Layout2, and Layout3 (colors, typography, spacing, borders)
- Provide a two-row layout: first row with 2 featured articles (with images), second row with 4-column grid
- Use dashed borders to separate rows and maintain newspaper aesthetic
- Support responsive layouts for mobile, tablet, and desktop viewports
- Support Arabic RTL text direction and proper text rendering
- Ensure accessibility compliance for keyboard navigation and screen readers
- Handle edge cases gracefully (empty states, insufficient data, missing images)

## Architecture

### Component Structure

Layout6 follows a functional component architecture consistent with other layout components. The component is organized into two main sections separated by a dashed border:

1. **First Row - Featured Articles**: Displays 2 articles in a 2-column grid with large images, titles, and descriptions
2. **Second Row - Grid Articles**: Displays 4 articles in a 4-column grid with titles and descriptions (no images)

```
Layout6
├── First Row Container (2-column grid)
│   ├── Featured Article 1 (posts[0])
│   │   ├── Title
│   │   ├── Description
│   │   └── Image
│   └── Featured Article 2 (posts[1])
│       ├── Title
│       ├── Description
│       └── Image
├── Dashed Border Separator
└── Second Row Container (4-column grid)
    ├── Grid Article 1 (posts[2])
    ├── Grid Article 2 (posts[3])
    ├── Grid Article 3 (posts[4])
    └── Grid Article 4 (posts[5])
```

### State Management

Layout6 is a stateless functional component. It does not require internal state management as it purely renders the provided posts data without user interactions that modify component state.

### Responsive Breakpoints

Layout6 uses Tailwind CSS responsive breakpoints consistent with other layouts:

- **Mobile** (< 768px): Single column, stacked layout for both rows
- **Tablet** (md: 768px - 1023px): 2-column grid for first row, 2-column grid for second row
- **Desktop** (lg: ≥ 1024px): 2-column grid for first row, 4-column grid for second row

### Data Flow

```
Parent Component (e.g., home.tsx)
    ↓
  posts: Post[]
    ↓
  Layout6
    ↓
  ├── posts[0-1] → First Row (Featured Articles)
    ↓
  └── posts[2-5] → Second Row (Grid Articles)
```

The component receives a posts array and slices it to distribute articles across the two rows. It handles cases where fewer than 6 posts are available by conditionally rendering sections.

## Components and Interfaces

### Layout6 Component

**File**: `app/layouts/Layout6.tsx`

**Props Interface**:
```typescript
interface Layout6Props {
  posts: Post[];
}
```

**Exports**:
```typescript
export default function Layout6({ posts }: Layout6Props): JSX.Element
```

### Post Type (Imported)

**Source**: `app/services/postsService.ts`

**Interface**:
```typescript
interface Post {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  imageDescription?: string;
  categoryName: string;
  categorySlug: string;
  authorName: string;
  authorSlug: string;
  // ... additional fields
}
```

**Key Fields Used by Layout6**:
- `id`: Unique identifier for React keys
- `title`: Article headline
- `slug`: URL-safe article identifier
- `description`: Article summary text
- `image`: Article image URL (used in first row only)
- `categorySlug`: URL-safe category identifier for navigation

### Featured Article Card Structure (First Row)

Each featured article card in the first row contains:

```typescript
<Link 
  to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
  className="block group"
>
  <article className="semafor-card overflow-hidden">
    <div className="p-4 mb-4">
      <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-blue-700 transition-colors">
        {post.title}
      </h3>
      {post.description && (
        <p className="text-sm md:text-base text-gray-700 line-clamp-3">
          {post.description}
        </p>
      )}
    </div>
    {post.image && (
      <div className="w-full overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
    )}
  </article>
</Link>
```

### Grid Article Card Structure (Second Row)

Each grid article card in the second row contains:

```typescript
<Link 
  to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
  className="block group"
>
  <article className="semafor-card p-4">
    <h3 className="text-sm md:text-base font-bold mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
      {post.title}
    </h3>
    {post.description && (
      <p className="text-xs md:text-sm text-gray-700 line-clamp-2">
        {post.description}
      </p>
    )}
  </article>
</Link>
```

### Dashed Border Separator

The separator between rows uses:

```typescript
<div className="border-t border-dashed border-black/10 my-6 md:my-8" />
```

This matches the border styling used in Layout1, Layout2, and Layout3 for visual consistency.

## Data Models

### Layout6Props

```typescript
interface Layout6Props {
  posts: Post[];
}
```

**Description**: Props interface for the Layout6 component.

**Fields**:
- `posts` (Post[]): Array of article data to display in the layout

**Validation**:
- Must be an array (can be empty)
- Each element must conform to Post interface
- Component handles empty arrays gracefully
- Component handles arrays with fewer than 6 posts

### Post (External)

Defined in `app/services/postsService.ts`. Layout6 uses a subset of Post fields:

**Required Fields**:
- `id`: string - Unique identifier for React keys
- `title`: string - Article headline
- `slug`: string - URL identifier for navigation
- `categorySlug`: string - Category URL identifier for navigation

**Optional Fields**:
- `description`: string - Article summary (displayed if present)
- `image`: string - Image URL (used in first row, conditionally rendered)
- `categoryName`: string - Category display name (not used in Layout6)
- `authorName`: string - Author name (not used in Layout6)

**Usage in Layout6**:
- First row (posts[0-1]): Uses title, description, image, slug, categorySlug
- Second row (posts[2-5]): Uses title, description, slug, categorySlug (no images)


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I identified the following redundancies:
- Properties 8.2 and 10.3 both test alt text on images - combined into Property 5
- Multiple properties test CSS class application (styling) - these are better tested as examples rather than properties
- Properties about first row and second row article distribution can be combined into a single comprehensive property

### Property 1: Post Array Acceptance

*For any* array of Post objects (including empty arrays), the Layout6 component SHALL render without throwing errors.

**Validates: Requirements 1.1**

### Property 2: First Row Article Distribution

*For any* posts array with at least 2 items, the first row SHALL display exactly the first 2 posts (posts[0] and posts[1]) with their titles, descriptions, and images.

**Validates: Requirements 2.1, 2.2**

### Property 3: Second Row Article Distribution

*For any* posts array with at least 6 items, the second row SHALL display exactly posts 3-6 (posts[2] through posts[5]) with their titles and descriptions.

**Validates: Requirements 3.1, 3.2**

### Property 4: Image Lazy Loading

*For any* post with a non-empty image property rendered in the first row, the img element SHALL include the loading="lazy" attribute.

**Validates: Requirements 8.1**

### Property 5: Image Alt Text

*For any* post with a non-empty image property rendered in the first row, the img element SHALL include an alt attribute with the post's title as its value.

**Validates: Requirements 8.2, 10.3**

### Property 6: Image Styling

*For any* post with a non-empty image property rendered in the first row, the img element SHALL include the object-cover CSS class.

**Validates: Requirements 8.3**

### Property 7: Article Link Wrapping

*For any* post rendered in either row, the article SHALL be wrapped in a Link component from react-router.

**Validates: Requirements 6.1**

### Property 8: Article URL Construction

*For any* post rendered in either row, the Link component's to prop SHALL match the pattern `/posts/categories/{post.categorySlug}/articles/{post.slug}`.

**Validates: Requirements 6.2**

### Property 9: Partial Data Rendering

*For any* posts array with fewer than 6 items, the component SHALL render only the available posts without errors, displaying posts[0-1] in the first row (if available) and posts[2-5] in the second row (if available).

**Validates: Requirements 9.1**

### Property 10: Missing Image Handling

*For any* post in the first row with an undefined, null, or empty string image property, the component SHALL render the article with title and description but without an img element, and the layout SHALL remain intact.

**Validates: Requirements 9.3**

### Property 11: Missing Description Handling

*For any* post with an undefined, null, or empty string description property, the component SHALL render the article with only the title, and the layout SHALL remain intact.

**Validates: Requirements 9.4**

## Error Handling

### Invalid Props Handling

**Empty Posts Array**:
- When `posts` is an empty array, render an empty state or return null
- No errors thrown, graceful degradation
- Component structure remains valid

**Undefined/Null Posts**:
- Component should handle `undefined` or `null` posts prop
- Default to empty array: `const safePosts = posts || []`
- Prevents runtime crashes from missing data

**Insufficient Data**:
- When posts.length < 2: Display only available posts in first row (0 or 1 post)
- When posts.length < 6: Display available posts in first row (2 posts) and partial second row (0-3 posts)
- No placeholder elements for missing posts
- Grid layout adjusts to available content

### Missing Post Fields

**Missing Image**:
- Conditionally render image: `{post.image && <img ... />}`
- Article card displays title and description without image
- Layout remains intact, no broken image placeholders
- Only affects first row articles (second row doesn't use images)

**Missing Description**:
- Conditionally render description: `{post.description && <p>{post.description}</p>}`
- Article card displays title only
- No empty paragraph elements
- Applies to both first and second row articles

**Missing Title**:
- Title is a required field in Post interface (TypeScript enforces)
- If missing at runtime, article will display with empty heading
- Backend validation should prevent this scenario

**Missing Slugs**:
- Required fields in Post interface (TypeScript enforces)
- If missing at runtime, link will be malformed
- Router handles 404 errors for invalid routes
- Backend validation should prevent this scenario

### React Rendering Errors

**React Key Warnings**:
- All mapped elements use unique `key` prop
- Posts use `post.id` as key
- Prevents React reconciliation errors
- Ensures stable component identity across re-renders

**Conditional Rendering**:
- Use explicit conditional checks: `{condition && <Element />}`
- Avoid rendering `undefined` or `null` directly in JSX
- Use optional chaining for nested properties: `post?.image`

### Navigation Errors

**Invalid Slugs**:
- Component passes slugs as-is to React Router
- Router handles 404 errors for invalid routes
- Layout6 does not validate slug format
- Backend should ensure slugs are URL-safe

**Link Component Errors**:
- React Router Link component handles navigation errors
- Component only responsible for correct URL construction
- No try-catch needed around Link rendering

## Testing Strategy

### Dual Testing Approach

Layout6 will be tested using both unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests**: Focus on specific examples, edge cases, and integration points
- Empty posts array renders empty state or null
- Single post displays only in first row
- Two posts display only in first row
- Six posts display correctly across both rows
- CSS classes are applied correctly (semafor-card, group, hover classes)
- Dashed border separator is present between rows
- Responsive CSS classes are applied (md:, lg:)
- Semantic HTML elements are used (article, h3)

**Property-Based Tests**: Verify universal properties across all inputs
- Post array acceptance (Property 1)
- Article distribution (Properties 2-3)
- Image attributes (Properties 4-6)
- Link wrapping and URL construction (Properties 7-8)
- Partial data handling (Property 9)
- Missing field handling (Properties 10-11)

### Property-Based Testing Configuration

**Library**: fast-check (JavaScript/TypeScript property-based testing library)

**Installation**:
```bash
npm install --save-dev fast-check @testing-library/react @testing-library/jest-dom
```

**Test Configuration**:
- Minimum 100 iterations per property test
- Each test references its design document property
- Tag format: `// Feature: newspaper-layout-6, Property {number}: {property_text}`

### Test Data Generators

**Post Generator**:
```typescript
import * as fc from 'fast-check';

const postArbitrary = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 10, maxLength: 100 }),
  slug: fc.stringOf(
    fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789-'.split('')),
    { minLength: 5, maxLength: 50 }
  ),
  description: fc.option(fc.string({ minLength: 20, maxLength: 200 }), { nil: undefined }),
  image: fc.option(fc.webUrl(), { nil: undefined }),
  categorySlug: fc.stringOf(
    fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789-'.split('')),
    { minLength: 5, maxLength: 30 }
  ),
  categoryName: fc.string({ minLength: 5, maxLength: 30 }),
  authorName: fc.string({ minLength: 5, maxLength: 50 }),
  authorSlug: fc.stringOf(
    fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789-'.split('')),
    { minLength: 5, maxLength: 30 }
  ),
});
```

**Arabic Text Generator** (for future use):
```typescript
const arabicTextArbitrary = fc.stringOf(
  fc.constantFrom(...'ابتثجحخدذرزسشصضطظعغفقكلمنهوي '.split('')),
  { minLength: 10, maxLength: 100 }
);
```

**Posts Array Generator**:
```typescript
const postsArrayArbitrary = fc.array(postArbitrary, { minLength: 0, maxLength: 20 });
```

### Example Property Tests

**Property 1: Post Array Acceptance**
```typescript
// Feature: newspaper-layout-6, Property 1: Post Array Acceptance
describe('Layout6 - Post Array Acceptance', () => {
  it('should render without errors for any array of Post objects', () => {
    fc.assert(
      fc.property(
        fc.array(postArbitrary, { minLength: 0, maxLength: 20 }),
        (posts) => {
          const { container } = render(<Layout6 posts={posts} />);
          expect(container).toBeInTheDocument();
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

**Property 2: First Row Article Distribution**
```typescript
// Feature: newspaper-layout-6, Property 2: First Row Article Distribution
describe('Layout6 - First Row Article Distribution', () => {
  it('should display first 2 posts in first row for any posts array with 2+ items', () => {
    fc.assert(
      fc.property(
        fc.array(postArbitrary, { minLength: 2, maxLength: 20 }),
        (posts) => {
          const { container } = render(<Layout6 posts={posts} />);
          const firstRowArticles = container.querySelectorAll('[data-testid="first-row"] article');
          
          expect(firstRowArticles).toHaveLength(2);
          
          // Verify correct posts are displayed
          expect(firstRowArticles[0]).toHaveTextContent(posts[0].title);
          expect(firstRowArticles[1]).toHaveTextContent(posts[1].title);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

**Property 8: Article URL Construction**
```typescript
// Feature: newspaper-layout-6, Property 8: Article URL Construction
describe('Layout6 - Article URL Construction', () => {
  it('should construct correct URLs for all article links', () => {
    fc.assert(
      fc.property(
        fc.array(postArbitrary, { minLength: 1, maxLength: 10 }),
        (posts) => {
          const { container } = render(<Layout6 posts={posts} />);
          const links = container.querySelectorAll('a');
          
          links.forEach((link, index) => {
            const post = posts[index];
            const expectedHref = `/posts/categories/${post.categorySlug}/articles/${post.slug}`;
            expect(link.getAttribute('href')).toBe(expectedHref);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

**Property 10: Missing Image Handling**
```typescript
// Feature: newspaper-layout-6, Property 10: Missing Image Handling
describe('Layout6 - Missing Image Handling', () => {
  it('should render articles without images when image field is missing', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            ...postArbitrary,
            image: fc.constantFrom(undefined, null, ''),
          }),
          { minLength: 2, maxLength: 2 }
        ),
        (posts) => {
          const { container } = render(<Layout6 posts={posts} />);
          const images = container.querySelectorAll('[data-testid="first-row"] img');
          
          // No images should be rendered
          expect(images).toHaveLength(0);
          
          // But articles should still be present
          const articles = container.querySelectorAll('[data-testid="first-row"] article');
          expect(articles).toHaveLength(2);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Unit Test Examples

**Empty State Test**:
```typescript
describe('Layout6 - Empty State', () => {
  it('should render empty state or null when posts array is empty', () => {
    const { container } = render(<Layout6 posts={[]} />);
    const articles = container.querySelectorAll('article');
    expect(articles).toHaveLength(0);
  });
});
```

**Partial Data Test**:
```typescript
describe('Layout6 - Partial Data', () => {
  it('should render only first row when 2 posts provided', () => {
    const posts = [
      { id: '1', title: 'Post 1', slug: 'post-1', categorySlug: 'cat-1', description: 'Desc 1', image: 'img1.jpg' },
      { id: '2', title: 'Post 2', slug: 'post-2', categorySlug: 'cat-2', description: 'Desc 2', image: 'img2.jpg' },
    ];
    
    const { container } = render(<Layout6 posts={posts} />);
    const firstRowArticles = container.querySelectorAll('[data-testid="first-row"] article');
    const secondRowArticles = container.querySelectorAll('[data-testid="second-row"] article');
    
    expect(firstRowArticles).toHaveLength(2);
    expect(secondRowArticles).toHaveLength(0);
  });
  
  it('should render both rows when 6 posts provided', () => {
    const posts = Array.from({ length: 6 }, (_, i) => ({
      id: `${i}`,
      title: `Post ${i}`,
      slug: `post-${i}`,
      categorySlug: `cat-${i}`,
      description: `Desc ${i}`,
      image: i < 2 ? `img${i}.jpg` : undefined,
    }));
    
    const { container } = render(<Layout6 posts={posts} />);
    const firstRowArticles = container.querySelectorAll('[data-testid="first-row"] article');
    const secondRowArticles = container.querySelectorAll('[data-testid="second-row"] article');
    
    expect(firstRowArticles).toHaveLength(2);
    expect(secondRowArticles).toHaveLength(4);
  });
});
```

**CSS Classes Test**:
```typescript
describe('Layout6 - CSS Classes', () => {
  it('should apply semafor-card class to all articles', () => {
    const posts = Array.from({ length: 6 }, (_, i) => ({
      id: `${i}`,
      title: `Post ${i}`,
      slug: `post-${i}`,
      categorySlug: `cat-${i}`,
      description: `Desc ${i}`,
      image: i < 2 ? `img${i}.jpg` : undefined,
    }));
    
    const { container } = render(<Layout6 posts={posts} />);
    const articles = container.querySelectorAll('article');
    
    articles.forEach(article => {
      expect(article).toHaveClass('semafor-card');
    });
  });
  
  it('should apply group class to all Link elements', () => {
    const posts = Array.from({ length: 6 }, (_, i) => ({
      id: `${i}`,
      title: `Post ${i}`,
      slug: `post-${i}`,
      categorySlug: `cat-${i}`,
      description: `Desc ${i}`,
      image: i < 2 ? `img${i}.jpg` : undefined,
    }));
    
    const { container } = render(<Layout6 posts={posts} />);
    const links = container.querySelectorAll('a');
    
    links.forEach(link => {
      expect(link).toHaveClass('group');
    });
  });
});
```

**Dashed Border Test**:
```typescript
describe('Layout6 - Dashed Border', () => {
  it('should render dashed border separator between rows when both rows have content', () => {
    const posts = Array.from({ length: 6 }, (_, i) => ({
      id: `${i}`,
      title: `Post ${i}`,
      slug: `post-${i}`,
      categorySlug: `cat-${i}`,
      description: `Desc ${i}`,
      image: i < 2 ? `img${i}.jpg` : undefined,
    }));
    
    const { container } = render(<Layout6 posts={posts} />);
    const separator = container.querySelector('.border-dashed');
    
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveClass('border-t', 'border-black/10');
  });
});
```

### Integration Testing

**React Router Integration**:
- Test that clicking article links triggers navigation
- Verify correct route parameters are passed
- Use MemoryRouter for isolated testing

```typescript
describe('Layout6 - Navigation', () => {
  it('should navigate to correct article page when link is clicked', () => {
    const posts = [
      { id: '1', title: 'Post 1', slug: 'post-1', categorySlug: 'cat-1', description: 'Desc 1', image: 'img1.jpg' },
    ];
    
    const { getByText } = render(
      <MemoryRouter>
        <Layout6 posts={posts} />
      </MemoryRouter>
    );
    
    const link = getByText('Post 1').closest('a');
    expect(link).toHaveAttribute('href', '/posts/categories/cat-1/articles/post-1');
  });
});
```

**Responsive Behavior**:
- Verify responsive CSS classes are applied (md:, lg:)
- Test that grid column counts change at breakpoints
- Use matchMedia mocks for different viewport sizes

### Accessibility Testing

**Automated Checks**:
- Use jest-axe for automated accessibility testing
- Verify ARIA attributes where applicable
- Check keyboard navigation flow

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Layout6 - Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const posts = Array.from({ length: 6 }, (_, i) => ({
      id: `${i}`,
      title: `Post ${i}`,
      slug: `post-${i}`,
      categorySlug: `cat-${i}`,
      description: `Desc ${i}`,
      image: i < 2 ? `img${i}.jpg` : undefined,
    }));
    
    const { container } = render(<Layout6 posts={posts} />);
    const results = await axe(container);
    
    expect(results).toHaveNoViolations();
  });
});
```

**Manual Testing Checklist**:
- Screen reader announces article titles correctly
- All interactive elements are keyboard accessible
- Focus indicators are visible
- Color contrast meets WCAG AA standards
- Images have descriptive alt text
- Semantic HTML structure is correct

### Performance Testing

**Rendering Performance**:
- Measure render time with 20+ posts
- Verify no unnecessary re-renders
- Check memory usage with large datasets

**Image Loading**:
- Verify lazy loading attribute is applied
- Test that images load progressively
- Check network waterfall for optimization
- Ensure images don't block initial render
