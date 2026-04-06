# Requirements Document

## Introduction

The homepage currently renders category sections using a hardcoded layout rotation array (`[2, 4, 5, 6, 7, 8, 6, 7, 11, 7]`) that assigns layout components to categories by index position. The `Category` API response already returns `layout`, `order`, and `showOnHomepage` fields, but the `layout` field is ignored and `showOnHomepage` is not used for filtering.

This feature replaces the hardcoded approach with a fully CMS-driven system: the homepage reads `layout` and `order` directly from each category's API response, and filters by `showOnHomepage`. The backend returns layout identifiers as full strings (e.g., `"Layout2"`, `"Layout6"`) from a set of Layout1–Layout13. The frontend currently implements Layout2, Layout4, Layout5, Layout6, Layout7, Layout8, and Layout11. Categories assigned layouts without a frontend implementation are skipped gracefully.

## Glossary

- **Homepage**: The root route (`/`) rendered by `app/routes/home.tsx`
- **Category**: A content grouping returned by `GET /api/v1/categories`, containing `id`, `name`, `slug`, `order`, `layout`, `showOnHomepage`, and other fields
- **Layout Identifier**: A string value returned in the `layout` field of a Category (e.g., `"Layout2"`, `"Layout6"`, `"Layout11"`), corresponding to a Layout Component
- **Layout Component**: One of the React components (Layout2, Layout4, Layout5, Layout6, Layout7, Layout8, Layout11) that renders a category section in a specific visual style
- **Implemented Layout**: A Layout Identifier for which a frontend Layout Component exists: `"Layout2"`, `"Layout4"`, `"Layout5"`, `"Layout6"`, `"Layout7"`, `"Layout8"`, `"Layout11"`
- **Unimplemented Layout**: A Layout Identifier returned by the API for which no frontend component exists (e.g., `"Layout1"` used as category layout, `"Layout3"`, `"Layout9"`, `"Layout10"`, `"Layout12"`, `"Layout13"`)
- **CMS**: The content management system that controls category metadata including `layout`, `order`, and `showOnHomepage`
- **Homepage_Renderer**: The component logic in `app/routes/home.tsx` responsible for selecting and rendering Layout Components for each category
- **Category_Filter**: The logic that determines which categories appear on the homepage
- **layoutOrder**: The hardcoded array `[2, 4, 5, 6, 7, 8, 6, 7, 11, 7]` currently used to assign layouts — to be removed

## Requirements

### Requirement 1: CMS-Driven Layout Selection

**User Story:** As a content editor, I want each category's layout to be determined by the CMS-configured `layout` field, so that I can change how a category section looks without requiring a frontend code deployment.

#### Acceptance Criteria

1. WHEN the Homepage renders a category section, THE Homepage_Renderer SHALL use the `layout` field from the Category API response to select the Layout Component, instead of the hardcoded `layoutOrder` array.
2. WHEN a Category has a Layout Identifier of `"Layout2"`, `"Layout4"`, `"Layout5"`, `"Layout6"`, `"Layout7"`, `"Layout8"`, or `"Layout11"`, THE Homepage_Renderer SHALL render the corresponding Layout Component.
3. THE Homepage_Renderer SHALL remove the hardcoded `layoutOrder` array entirely from the codebase.
4. IF a Category has an Unimplemented Layout Identifier, THEN THE Homepage_Renderer SHALL skip rendering that category section and emit a `console.warn` identifying the category slug and the unrecognized layout value.
5. IF a Category's `layout` field is an empty string or `null`, THEN THE Homepage_Renderer SHALL skip that category section without throwing an error.

### Requirement 2: CMS-Driven Category Filtering

**User Story:** As a content editor, I want the homepage to display only categories marked with `showOnHomepage: true`, so that I can control which categories appear on the homepage from the CMS without touching frontend code.

#### Acceptance Criteria

1. WHEN fetching categories for the homepage, THE Category_Filter SHALL include only categories where `showOnHomepage` is `true`.
2. THE Category_Filter SHALL remove the hardcoded `.slice(0, 10)` limit that previously capped homepage categories at 10.
3. WHEN no categories have `showOnHomepage` set to `true`, THE Homepage_Renderer SHALL render an empty state indicating no categories are available.

### Requirement 3: CMS-Driven Category Ordering

**User Story:** As a content editor, I want the display order of category sections to be determined by the CMS-configured `order` field, so that I can reorder homepage sections without a frontend deployment.

#### Acceptance Criteria

1. WHEN rendering category sections, THE Homepage_Renderer SHALL sort categories in ascending order by their `order` field from the API response.
2. WHEN two categories have the same `order` value, THE Homepage_Renderer SHALL sort them in ascending alphabetical order by `name` as a stable tiebreaker.

### Requirement 4: Layout Component Compatibility

**User Story:** As a developer, I want the CMS-driven layout selection to support all currently implemented Layout Components, so that no visual regressions occur during the migration.

#### Acceptance Criteria

1. THE Homepage_Renderer SHALL support all seven Implemented Layouts: `"Layout2"`, `"Layout4"`, `"Layout5"`, `"Layout6"`, `"Layout7"`, `"Layout8"`, and `"Layout11"`.
2. WHEN rendering a category with Layout Identifier `"Layout7"`, THE Homepage_Renderer SHALL pass `showAdvertisement={true}` only when that category is the last one in the rendered list.
3. WHEN rendering a category with Layout Identifier `"Layout2"`, THE Homepage_Renderer SHALL continue to pass `newsletterCategories` as a prop, as required by that component.

### Requirement 5: Graceful Handling of Unimplemented Layouts

**User Story:** As a developer, I want the homepage to handle categories assigned layouts that have no frontend implementation, so that a CMS misconfiguration or a future layout addition does not break the entire homepage.

#### Acceptance Criteria

1. WHILE the homepage is rendering, THE Homepage_Renderer SHALL continue rendering all remaining valid category sections even if one or more categories have Unimplemented Layout Identifiers.
2. IF a Category has an Unimplemented Layout Identifier, THEN THE Homepage_Renderer SHALL emit a `console.warn` message containing the category slug and the unrecognized layout value.
3. THE Homepage_Renderer SHALL treat categories with Unimplemented Layout Identifiers as if they do not exist for the purpose of border rendering and the `showAdvertisement` last-item check.
