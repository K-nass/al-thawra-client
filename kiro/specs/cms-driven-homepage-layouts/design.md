# Design Document: CMS-Driven Dynamic Category Layout & Ordering on Homepage

## Overview

The homepage currently uses a hardcoded `layoutOrder` array to assign layout components to categories by index. This design replaces that mechanism with a direct mapping from each category's `layout` field (a string like `"Layout6"`) to the corresponding React component, while also switching the category filter from a `.slice(0, 10)` to a `showOnHomepage: true` predicate.

The change is intentionally minimal: no new services, no new data fetching, no new components. The only modifications are inside `app/routes/home.tsx` — specifically the `useEffect` that prepares categories and the `renderCategoryLayout` function.

## Architecture

The existing data flow is preserved:

```
Root Loader → outlet context (categories[])
                    ↓
         Home component useEffect
                    ↓
         Filter by showOnHomepage
         Sort by order (then name)
                    ↓
         Fetch posts per category
                    ↓
         renderCategoryLayout(category.layout, data, isLast)
                    ↓
         Layout Component rendered
```

The only architectural change is that `renderCategoryLayout` now receives the layout identifier string from the category itself rather than from a positional lookup in `layoutOrder`.

## Components and Interfaces

### Layout Identifier → Component Map

The core of this feature is a lookup map that replaces the `switch` on a hardcoded number:

```ts
const LAYOUT_COMPONENTS: Record<string, (data: CategoryData, props: LayoutProps) => React.ReactNode> = {
  Layout2:  (data, { newsletterCategories }) => <Layout2 posts={data.posts} newsletterCategories={newsletterCategories} />,
  Layout4:  (data) => <Layout4 categoryData={data} />,
  Layout5:  (data) => <Layout5 categoryData={data} />,
  Layout6:  (data) => <Layout6 posts={data.posts} />,
  Layout7:  (data, { showAdvertisement }) => <Layout7 categoryData={data} showAdvertisement={showAdvertisement} />,
  Layout8:  (data) => <Layout8 categoryData={data} />,
  Layout11: (data) => <Layout11 posts={data.posts} />,
};
```

This map is defined once at module level (outside the component) so it is not recreated on every render.

### Modified: `renderCategoryLayout`

The existing function signature changes from:

```ts
function renderCategoryLayout(layoutNumber: number, data: ..., isLast: boolean)
```

to:

```ts
function renderCategoryLayout(layoutId: string, data: ..., isLast: boolean, newsletterCategories: Category[])
```

The function looks up `layoutId` in `LAYOUT_COMPONENTS`. If not found, it emits `console.warn` and returns `null`.

### Modified: `useEffect` category preparation

The existing logic:

```ts
const limitedCategories = categories
  .sort((a, b) => a.order - b.order)
  .slice(0, 10);
```

becomes:

```ts
const homepageCategories = categories
  .filter((cat) => cat.showOnHomepage)
  .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
```

### Modified: `Category` type

The `Category` interface in `app/services/categoriesService.ts` already has a `layout` field missing from the current type definition. It needs to be added:

```ts
export interface Category {
  // ... existing fields ...
  layout: string;
}
```

## Data Models

No new data models are introduced. The existing `Category` type is extended with the `layout` field that the API already returns.

```ts
export interface Category {
  id: string;
  name: string;
  slug: string;
  language: string;
  description: string;
  colorHex: string;
  order: number;
  layout: string;           // ← add this field
  isActive: boolean;
  showOnMenu: boolean;
  showOnHomepage: boolean;
  parentCategoryId: string | null;
  parentCategoryName: string | null;
  parentCategorySlug: string | null;
  postsCount: number;
  subCategoriesCount: number;
  subCategories: Category[];
}
```

The set of known Implemented Layouts can be expressed as a type for safety:

```ts
export type ImplementedLayoutId = "Layout2" | "Layout4" | "Layout5" | "Layout6" | "Layout7" | "Layout8" | "Layout11";
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Only `showOnHomepage` categories are rendered

*For any* list of categories with mixed `showOnHomepage` values, after filtering, every category in the resulting list must have `showOnHomepage === true`.

**Validates: Requirements 2.1**

### Property 2: Categories are sorted by `order` ascending, then `name` alphabetically

*For any* list of homepage categories, after sorting, for every adjacent pair `(a, b)` the condition `a.order < b.order || (a.order === b.order && a.name <= b.name)` must hold.

**Validates: Requirements 3.1, 3.2**

### Property 3: Known layout identifiers always resolve to a non-null render

*For any* category whose `layout` field is one of the seven Implemented Layouts (`"Layout2"`, `"Layout4"`, `"Layout5"`, `"Layout6"`, `"Layout7"`, `"Layout8"`, `"Layout11"`), `renderCategoryLayout` must return a non-null React node.

**Validates: Requirements 1.2, 4.1**

### Property 4: Unknown layout identifiers always return null and warn

*For any* category whose `layout` field is not in the set of Implemented Layouts (including empty string and null), `renderCategoryLayout` must return `null` and must have called `console.warn` exactly once with a message containing the category slug.

**Validates: Requirements 1.4, 1.5, 5.2**

### Property 5: `showAdvertisement` is true only for the last rendered category with Layout7

*For any* list of rendered categories, `showAdvertisement={true}` is passed to Layout7 if and only if that category is the last item in the rendered list.

**Validates: Requirements 4.2**

### Property 6: Unimplemented layouts do not affect the last-item determination

*For any* list of categories where the final category has an Unimplemented Layout, the last category with an Implemented Layout is treated as the last item for `showAdvertisement` and border rendering purposes.

**Validates: Requirements 5.3**

## Error Handling

| Scenario | Behavior |
|---|---|
| `layout` is `null` or `""` | Skip category, no error thrown |
| `layout` is an unrecognized string (e.g., `"Layout9"`) | Skip category, emit `console.warn` with slug and layout value |
| `layout` is a known identifier but posts array is empty | Category already excluded upstream (existing behavior: only pushed to results if `posts.length > 0`) |
| All categories have `showOnHomepage: false` | Renders existing empty state (no `categoryPosts`) |

No new error boundaries are needed. The existing try/catch around each category's post fetch already handles network failures.

## Testing Strategy

### Unit Tests

Focus on the pure functions that can be tested in isolation:

- **Filter function**: given a mixed array of categories, only those with `showOnHomepage: true` are returned
- **Sort function**: given categories with equal and unequal `order` values, the output is correctly ordered
- **`renderCategoryLayout`**: given each of the seven known layout identifiers, returns a non-null node; given unknown identifiers, returns null and calls `console.warn`

### Property-Based Tests

Use a property-based testing library (e.g., `fast-check` for TypeScript) with a minimum of 100 iterations per property.

Each property test must be tagged with a comment in the format:
`// Feature: cms-driven-homepage-layouts, Property N: <property text>`

- **Property 1** — Generate random arrays of categories with random `showOnHomepage` booleans; assert every item in the filtered result has `showOnHomepage === true`
- **Property 2** — Generate random arrays of categories with random `order` integers and `name` strings; assert the sorted output satisfies the ordering invariant for every adjacent pair
- **Property 3** — Generate random categories with a layout drawn from the seven Implemented Layouts; assert `renderCategoryLayout` returns non-null
- **Property 4** — Generate random categories with a layout drawn from strings outside the Implemented set; assert `renderCategoryLayout` returns null and `console.warn` was called
- **Property 5 & 6** — Generate random lists of categories with mixed implemented/unimplemented layouts; assert `showAdvertisement` is true only for the last item with an Implemented Layout
