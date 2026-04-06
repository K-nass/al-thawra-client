# Implementation Plan: CMS-Driven Dynamic Category Layout & Ordering on Homepage

## Overview

All changes are confined to two files: `app/services/categoriesService.ts` (add `layout` field to the `Category` type) and `app/routes/home.tsx` (replace hardcoded `layoutOrder` with CMS-driven lookup). No new files, no new services.

## Tasks

- [x] 1. Add `layout` field to the `Category` type
  - In `app/services/categoriesService.ts`, add `layout: string` to the `Category` interface
  - Also add `ImplementedLayoutId` union type: `"Layout2" | "Layout4" | "Layout5" | "Layout6" | "Layout7" | "Layout8" | "Layout11"`
  - _Requirements: 1.1, 1.2_

- [x] 2. Replace hardcoded layout logic in `home.tsx`
  - [x] 2.1 Remove the `layoutOrder` array and replace `renderCategoryLayout` with a map-based lookup
    - Define `LAYOUT_COMPONENTS` map at module level (outside the component) mapping each `ImplementedLayoutId` string to its render function
    - Rewrite `renderCategoryLayout(layoutId: string, data, isLast, newsletterCategories)` to look up `layoutId` in the map
    - If not found: call `console.warn` with the category slug and layout value, return `null`
    - If `layoutId` is empty string or nullish: return `null` silently (no warn needed — treat same as unimplemented per req 1.5)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 4.1, 4.2, 4.3_

  - [x] 2.2 Update the `useEffect` category preparation logic
    - Replace `.sort(...).slice(0, 10)` with `.filter(cat => cat.showOnHomepage).sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))`
    - _Requirements: 2.1, 2.2, 3.1, 3.2_

  - [x] 2.3 Update the render loop to use `category.layout` and compute `isLast` correctly
    - Pass `category.layout` to `renderCategoryLayout` instead of `layoutOrder[idx % layoutOrder.length]`
    - Compute `isLast` based on the last category in `categoryPosts` whose layout is in the implemented set (so unimplemented layouts don't steal the last-item flag)
    - Pass `newsletterCategories` as the fourth argument to `renderCategoryLayout`
    - _Requirements: 1.1, 4.2, 5.3_

- [ ] 3. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 4. Write property tests for filter and sort logic
  - [ ]* 4.1 Write property test for category filter
    - **Property 1: Only `showOnHomepage` categories pass through, no count cap**
    - **Validates: Requirements 2.1, 2.2**
    - Use `fast-check` to generate random Category arrays with mixed `showOnHomepage` values and counts > 10
    - Assert every item in the filtered result has `showOnHomepage === true` and result length equals the count of `showOnHomepage: true` items in the input
    - `// Feature: cms-driven-homepage-layouts, Property 1: filter correctness`

  - [ ]* 4.2 Write property test for category sort
    - **Property 2: Adjacent pairs satisfy order ascending + name tiebreaker**
    - **Validates: Requirements 3.1, 3.2**
    - Generate random Category arrays with random `order` integers and `name` strings
    - Assert for every adjacent pair `(a, b)`: `a.order < b.order || (a.order === b.order && a.name <= b.name)`
    - `// Feature: cms-driven-homepage-layouts, Property 2: sort invariant`

  - [ ]* 4.3 Write property test for known layout resolution
    - **Property 3: Known layout identifiers always resolve to non-null**
    - **Validates: Requirements 1.2, 4.1**
    - Generate random categories with `layout` drawn from the seven implemented identifiers
    - Assert `renderCategoryLayout` returns a non-null React node
    - `// Feature: cms-driven-homepage-layouts, Property 3: known layouts resolve`

  - [ ]* 4.4 Write property test for unknown layout handling
    - **Property 4: Unknown/empty layouts return null and warn**
    - **Validates: Requirements 1.4, 1.5, 5.2**
    - Generate random strings not in the implemented set (including `""` and `null`)
    - Assert `renderCategoryLayout` returns `null` and `console.warn` was called for non-empty unrecognized values
    - `// Feature: cms-driven-homepage-layouts, Property 4: unknown layouts return null`

  - [ ]* 4.5 Write property test for `showAdvertisement` last-item flag
    - **Property 5: `showAdvertisement` is true only for the last category with an implemented layout**
    - **Validates: Requirements 4.2, 5.3**
    - Generate random lists of categories with mixed implemented/unimplemented layouts
    - Assert `showAdvertisement` is passed as `true` only to the last category whose layout is in the implemented set
    - `// Feature: cms-driven-homepage-layouts, Property 5: showAdvertisement last-item`

  - [ ]* 4.6 Write property test for rendering resilience
    - **Property 6: Rendered count equals implemented-layout category count**
    - **Validates: Requirements 5.1**
    - Generate random lists with a mix of implemented and unimplemented layouts
    - Assert the number of non-null render results equals the count of categories with implemented layouts
    - `// Feature: cms-driven-homepage-layouts, Property 6: resilience`

- [ ] 5. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster rollout
- `fast-check` is the recommended property-based testing library for TypeScript
- The `renderCategoryLayout` function should be extracted to a pure function (no JSX side effects) to make it unit-testable without a full React render
- Layout1 is the fixed hero section and is never used as a category layout component — categories with `layout: "Layout1"` from the API should be treated as unimplemented and skipped
