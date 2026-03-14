# Design Document: Layout2 Component

## Overview

Layout2 is a newspaper-style layout component that displays articles in a structured two-row grid format. The component follows the visual design language established by Layout1, using the same color palette (#b8d4e0 accent color), typography, and responsive patterns while introducing a new layout structure optimized for displaying 7 articles plus a subscription section.

The component serves as a content presentation module within the Al-Thawra news application, providing users with an organized view of multiple articles while maintaining visual consistency across the application. Layout2 integrates seamlessly with the existing React Router navigation system and uses the established Post data structure from the postsService.

Key design goals:
- Maintain visual consistency with Layout1 (colors, typography, spacing)
- Provide responsive layouts for mobile, tablet, and desktop viewports
- Support Arabic RTL text direction and proper text rendering
- Include collapsible briefings subscription functionality
- Ensure accessibility compliance for keyboard navigation and screen readers
- Handle edge cases gracefully (empty states, insufficient data)

## Architecture

### Component Structure

Layout2 follows a functional component architecture using React hooks for state management. The component is organized into three main sections:

1. **First Row Article Grid**: Displays 4 articles in a responsive grid
2. **Second Row Article Grid**: Displays 3 articles in a responsive grid
3. **Briefings Subscription Section**: Collapsible subscription interface

```
Layout2
├── First Row Container (grid)
│   ├── Article Card 1
│   ├── Article Card 2
│   ├── Article Card 3
│   └── Article Card 4
├── Second Row Container (grid)
│   ├── Article Card 5
│   ├── Article Card 6
│   ├── Article Card 7
│   └── Briefings Subscription (collapsible)
```

### State Management

The component uses React's useState hook to manage the collapsible state of the briefings subscription section:

```typescript
const [isExpanded, setIsExpanded] = useState(false);
```

This local state controls:
- Visibility of additional service items (show 3 vs show all)
- Toggle button icon direction (up arrow vs down arrow)
- ARIA expanded attribute for accessibility

### Responsive Breakpoints

Layout2 uses Tailwind CSS responsive breakpoints:

- **Mobile** (< 768px): Single column, stacked layout
- **Tablet** (md: 768px - 1023px): 2-column grids
- **Desktop** (lg: ≥ 1024px): 4-column first row, 4-column second row (3 articles + 1 subscription)

### Data Flow

```
Parent Component
    ↓
  posts: Post[]
    ↓
  Layout2
    ↓
  ├── posts[0-3] → First Row Grid
    ↓
  └── posts[4-6] → Second Row Grid
```

The component receives a posts array and slices it to distribute articles across the two rows. It handles cases where fewer than 7 posts are available by conditionally rendering sections.

## Components and Interfaces

### Layout2 Component

**File**: `app/layouts/Layout2.tsx`

**Props Interface**:
```typescript
interface Layout2Props {
  posts: Post[];
}
```

**Exports**:
```typescript
export default function Layout2({ posts }: Layout2Props): JSX.Element
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

**Key Fields Used by Layout2**:
- `id`: Unique identifier for React keys
- `title`: Article headline
- `slug`: URL-safe article identifier
- `description`: Article summary text
- `image`: Article image URL
- `categoryName`: Display name for article category
- `categorySlug`: URL-safe category identifier

### Article Card Structure

Each article card within the grid contains:

```typescript
<Link to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}>
  <article>
    {post.image && <img src={post.image} alt={post.title} loading="lazy" />}
    {post.categoryName && <span>{post.categoryName}</span>}
    <h3>{post.title}</h3>
    {post.description && <p>{post.description}</p>}
  </article>
</Link>
```

### Briefings Subscription Section

**Structure**:
```typescript
<div className="briefings-subscription">
  <h2>اشترك في نشراتنا الإخبارية</h2>
  <ul>
    {services.slice(0, isExpanded ? services.length : 3).map(service => (
      <li key={service.id}>
        <strong>{service.name}</strong>
        <p>{service.description}</p>
      </li>
    ))}
  </ul>
  <button 
    onClick={() => setIsExpanded(!isExpanded)}
    aria-expanded={isExpanded}
    aria-label={isExpanded ? "إخفاء الخدمات" : "عرض جميع الخدمات"}
  >
    {isExpanded ? <UpArrow /> : <DownArrow />}
  </button>
</div>
```

**Service Items Data Structure**:
```typescript
interface BriefingService {
  id: string;
  name: string;
  description: string;
}

const services: BriefingService[] = [
  { id: "1", name: "النشرة اليومية", description: "أهم الأخبار كل صباح" },
  { id: "2", name: "نشرة الأعمال", description: "تحديثات الأسواق والاقتصاد" },
  { id: "3", name: "نشرة التكنولوجيا", description: "آخر أخبار التقنية" },
  { id: "4", name: "نشرة الرياضة", description: "نتائج المباريات والأخبار الرياضية" },
  { id: "5", name: "نشرة الثقافة", description: "الفنون والثقافة والترفيه" },
  { id: "6", name: "نشرة السياسة", description: "التحليلات السياسية العميقة" },
];
```

## Data Models

### Layout2Props

```typescript
interface Layout2Props {
  posts: Post[];
}
```

**Description**: Props interface for the Layout2 component.

**Fields**:
- `posts` (Post[]): Array of article data to display in the layout

**Validation**:
- Must be an array (can be empty)
- Each element must conform to Post interface
- Component handles empty arrays gracefully

### Post (External)

Defined in `app/services/postsService.ts`. Layout2 uses a subset of Post fields:

**Required Fields**:
- `id`: string - Unique identifier
- `title`: string - Article headline
- `slug`: string - URL identifier
- `categorySlug`: string - Category URL identifier

**Optional Fields**:
- `description`: string - Article summary
- `image`: string - Image URL
- `categoryName`: string - Category display name
- `authorName`: string - Author name

### BriefingService (Internal)

```typescript
interface BriefingService {
  id: string;
  name: string;
  description: string;
}
```

**Description**: Internal data structure for briefing subscription services.

**Fields**:
- `id`: Unique identifier for React keys
- `name`: Service name in Arabic
- `description`: Service description in Arabic

**Usage**: Hardcoded array of 6 services displayed in the subscription section.


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: First Row Article Distribution

*For any* posts array with at least 4 items, the first row article grid SHALL display exactly the first 4 posts (posts[0] through posts[3]) in order.

**Validates: Requirements 2.4**

### Property 2: Second Row Article Distribution

*For any* posts array with at least 7 items, the second row article grid SHALL display exactly posts 5-7 (posts[4] through posts[6]) in order.

**Validates: Requirements 3.4**

### Property 3: Image Rendering

*For any* post with a non-empty image property, the rendered article card SHALL contain an img element with src attribute matching the post's image URL.

**Validates: Requirements 4.1**

### Property 4: Title Link Rendering

*For any* post, the rendered article card SHALL contain a clickable link element with the post's title as text content.

**Validates: Requirements 4.2**

### Property 5: Description Rendering

*For any* post with a non-empty description property, the rendered article card SHALL display the description text.

**Validates: Requirements 4.3**

### Property 6: Navigation Link Format

*For any* post, the article card link SHALL have an href attribute matching the pattern `/posts/categories/{post.categorySlug}/articles/{post.slug}`.

**Validates: Requirements 4.4**

### Property 7: Toggle State Round-Trip

*For any* initial state (expanded or collapsed) of the briefings subscription section, clicking the toggle button twice SHALL return the section to its original state with the same number of visible service items.

**Validates: Requirements 5.3, 5.4**

### Property 8: Arabic Text Preservation

*For any* post with Arabic text in title, description, or categoryName fields, the rendered content SHALL display the exact text without corruption or character encoding issues.

**Validates: Requirements 8.3**

### Property 9: Image Accessibility Attributes

*For any* image rendered in the layout, the img element SHALL include both an alt attribute (for accessibility) and a loading="lazy" attribute (for performance).

**Validates: Requirements 9.7, 12.1**

### Property 10: Partial Data Rendering

*For any* posts array with fewer than 4 items, the first row SHALL display only the available posts without errors or empty placeholders.

**Validates: Requirements 10.2**

### Property 11: Conditional Second Row

*For any* posts array with fewer than 7 items, the second row article grid SHALL either not render or render only the available posts beyond the first 4.

**Validates: Requirements 10.3**

### Property 12: Service Item Completeness

*For any* service item displayed in the briefings subscription section, the rendered output SHALL include both the service name and description text.

**Validates: Requirements 11.3**


## Error Handling

### Invalid Props Handling

**Empty Posts Array**:
- When `posts` is an empty array, display "لا توجد مقالات متاحة" message
- No errors thrown, graceful degradation
- Layout structure remains intact

**Undefined/Null Posts**:
- Component should handle `undefined` or `null` posts prop
- Default to empty array: `const safePosts = posts || []`
- Prevents runtime crashes from missing data

**Insufficient Data**:
- When posts.length < 4: Display only available posts in first row
- When posts.length < 7: Do not render second row article grid
- Briefings subscription always renders regardless of posts count

### Missing Post Fields

**Missing Image**:
- Conditionally render image: `{post.image && <img ... />}`
- Article card displays without image, layout remains intact
- No broken image placeholders

**Missing Description**:
- Conditionally render description: `{post.description && <p>{post.description}</p>}`
- Article card displays title and image only
- No empty paragraph elements

**Missing Category Name**:
- Conditionally render category: `{post.categoryName && <span>{post.categoryName}</span>}`
- Article card displays without category label
- Navigation still works using categorySlug

### State Management Errors

**Toggle State Corruption**:
- useState ensures boolean state (true/false only)
- No intermediate states possible
- Toggle function uses functional update: `setIsExpanded(prev => !prev)`

**React Key Warnings**:
- All mapped elements use unique `key` prop
- Posts use `post.id` as key
- Services use `service.id` as key
- Prevents React reconciliation errors


### Navigation Errors

**Invalid Slugs**:
- Component passes slugs as-is to React Router
- Router handles 404 errors for invalid routes
- Layout2 does not validate slug format

**Missing Slugs**:
- Required fields in Post interface (TypeScript enforces)
- If missing at runtime, link will be malformed
- Backend validation should prevent this scenario

## Testing Strategy

### Dual Testing Approach

Layout2 will be tested using both unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests**: Focus on specific examples, edge cases, and integration points
- Empty posts array displays correct message
- Collapsed state shows exactly 3 services
- Expanded state shows all 6 services
- Toggle button has correct aria-expanded attribute
- Responsive CSS classes are applied correctly
- RTL attributes are present for Arabic content

**Property-Based Tests**: Verify universal properties across all inputs
- Article distribution properties (Properties 1-2)
- Rendering properties (Properties 3-6)
- State management properties (Property 7)
- Text handling properties (Property 8)
- Accessibility properties (Property 9)
- Data handling properties (Properties 10-12)

### Property-Based Testing Configuration

**Library**: fast-check (JavaScript/TypeScript property-based testing library)

**Installation**:
```bash
npm install --save-dev fast-check @testing-library/react @testing-library/jest-dom
```

**Test Configuration**:
- Minimum 100 iterations per property test
- Each test references its design document property
- Tag format: `// Feature: newspaper-layout-2, Property {number}: {property_text}`


### Test Data Generators

**Post Generator**:
```typescript
import * as fc from 'fast-check';

const postArbitrary = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 10, maxLength: 100 }),
  slug: fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789-'.split('')), { minLength: 5, maxLength: 50 }),
  description: fc.string({ minLength: 20, maxLength: 200 }),
  image: fc.webUrl(),
  categoryName: fc.string({ minLength: 5, maxLength: 30 }),
  categorySlug: fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789-'.split('')), { minLength: 5, maxLength: 30 }),
  authorName: fc.string({ minLength: 5, maxLength: 50 }),
  // ... other required Post fields with default values
});
```

**Arabic Text Generator**:
```typescript
const arabicTextArbitrary = fc.stringOf(
  fc.constantFrom(...'ابتثجحخدذرزسشصضطظعغفقكلمنهوي '.split('')),
  { minLength: 10, maxLength: 100 }
);
```

### Example Property Test

```typescript
// Feature: newspaper-layout-2, Property 1: First Row Article Distribution
describe('Layout2 - First Row Article Distribution', () => {
  it('should display first 4 posts in first row for any posts array with 4+ items', () => {
    fc.assert(
      fc.property(
        fc.array(postArbitrary, { minLength: 4, maxLength: 20 }),
        (posts) => {
          const { container } = render(<Layout2 posts={posts} />);
          const firstRowArticles = container.querySelectorAll('[data-testid="first-row"] article');
          
          expect(firstRowArticles).toHaveLength(4);
          
          // Verify correct posts are displayed
          firstRowArticles.forEach((article, index) => {
            expect(article).toHaveTextContent(posts[index].title);
          });
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
describe('Layout2 - Empty State', () => {
  it('should display "لا توجد مقالات متاحة" when posts array is empty', () => {
    const { getByText } = render(<Layout2 posts={[]} />);
    expect(getByText('لا توجد مقالات متاحة')).toBeInTheDocument();
  });
});
```

**Toggle State Test**:
```typescript
describe('Layout2 - Briefings Subscription Toggle', () => {
  it('should show 3 services when collapsed', () => {
    const { container } = render(<Layout2 posts={[]} />);
    const services = container.querySelectorAll('[data-testid="briefing-service"]');
    expect(services).toHaveLength(3);
  });

  it('should show all services when expanded', () => {
    const { container, getByRole } = render(<Layout2 posts={[]} />);
    const toggleButton = getByRole('button', { name: /عرض جميع الخدمات/ });
    
    fireEvent.click(toggleButton);
    
    const services = container.querySelectorAll('[data-testid="briefing-service"]');
    expect(services).toHaveLength(6);
  });
});
```

### Integration Testing

**React Router Integration**:
- Test that clicking article links triggers navigation
- Verify correct route parameters are passed
- Use MemoryRouter for isolated testing

**Responsive Behavior**:
- Use matchMedia mocks to test different breakpoints
- Verify grid column counts at each breakpoint
- Test mobile, tablet, and desktop layouts

### Accessibility Testing

**Automated Checks**:
- Use jest-axe for automated accessibility testing
- Verify ARIA attributes are present and correct
- Check keyboard navigation flow

**Manual Testing Checklist**:
- Screen reader announces article titles correctly
- Toggle button state is announced properly
- All interactive elements are keyboard accessible
- Focus indicators are visible
- Color contrast meets WCAG AA standards

### Performance Testing

**Rendering Performance**:
- Measure render time with 50+ posts
- Verify no unnecessary re-renders
- Check memory usage with large datasets

**Image Loading**:
- Verify lazy loading attribute is applied
- Test that images load progressively
- Check network waterfall for optimization

