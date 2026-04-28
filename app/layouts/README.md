# Layout Components

This directory contains reusable layout components for rendering category sections on the homepage.

## Available Layouts

### HeroSliderLayout
- **Backend ID**: `hero-slider`
- **Arabic Name**: شريط-رئيسي-مع-أشرطة-جانبية
- **Description**: 3-column layout with featured carousel in center, rotating articles on left, and "Yemen at a Glance" news feed on right
- **File**: `HeroSliderLayout.tsx`

### NewsletterGridLayout
- **Backend ID**: `newsletter-grid`
- **Arabic Name**: شبكة-النشرة-الإخبارية
- **Description**: Horizontal swiper of 4 articles on top, 3 articles below with newsletter subscription sidebar
- **File**: `NewsletterGridLayout.tsx`

### BalancedColumnsLayout
- **Backend ID**: `balanced-columns`
- **Arabic Name**: أعمدة-متوازنة
- **Description**: 3-column top section (3 small + 1 large featured + 3 small), 4-column bottom row
- **File**: `BalancedColumnsLayout.tsx`

### FeaturedWithRowLayout
- **Backend ID**: `featured-with-row`
- **Arabic Name**: مميز-مع-صف
- **Description**: Single large featured article on top (2-column split), 4 smaller articles in row below
- **File**: `FeaturedWithRowLayout.tsx`

### DualFeaturedLayout
- **Backend ID**: `dual-featured`
- **Arabic Name**: مميز-مزدوج
- **Description**: Two large featured articles on top, 4 smaller articles in row below
- **File**: `DualFeaturedLayout.tsx`

### SplitHeroLayout
- **Backend ID**: `split-hero`
- **Arabic Name**: بطل-منقسم
- **Description**: Two-column top (text-only left, image-only right), 4 smaller articles in row below
- **File**: `SplitHeroLayout.tsx`

### TripleColumnLayout
- **Backend ID**: `triple-column`
- **Arabic Name**: ثلاثة-أعمدة
- **Description**: 3 columns with images at bottom, optional advertisement banner at the end
- **File**: `TripleColumnLayout.tsx`

## Backend Integration

The backend should return one of these layout identifiers in the `layout` field of each category:
- `hero-slider` (Note: Only for fixed hero section, not for category layouts)
- `newsletter-grid`
- `balanced-columns`
- `featured-with-row`
- `dual-featured`
- `split-hero`
- `triple-column`

### Legacy Support

For backward compatibility, the following numeric identifiers are still supported:
- `Layout2` → NewsletterGridLayout
- `Layout4` → BalancedColumnsLayout
- `Layout5` → FeaturedWithRowLayout
- `Layout6` → DualFeaturedLayout
- `Layout7` → TripleColumnLayout
- `Layout8` → (not yet renamed)
- `Layout11` → SplitHeroLayout

## Usage

Layouts are automatically rendered based on the `layout` field from the category API response. The mapping is defined in `app/routes/home.tsx` in the `LAYOUT_COMPONENTS` constant.

If a category has an unimplemented layout identifier, it will be skipped gracefully with a console warning.
