# Layouts Data Guide

This document describes what data each layout expects and how posts are used internally.

---

## HeroSliderLayout (`hero-slider`)

Used directly in `home.tsx` — not via `LAYOUT_COMPONENTS`.

| Prop | Type | Source | Description |
|------|------|--------|-------------|
| `sliderPosts` | `Post[]` | `postsService.getSliderPosts(15, "Article")` | Center carousel slides (up to 15). Each slide shows title, summary, image, category name |
| `rightDirectionPosts` | `Post[]` | `postsService.getPosts({ direction: "Right" })` — up to 12 | Left sidebar: 1 featured article + 4 author cards, auto-rotates every 9s |
| `leftDirectionPosts` | `Post[]` | `postsService.getPosts({ direction: "Left" })` — up to 6 | Right sidebar "Yemen at a Glance": first 3 with image, next 4 text-only |
| `chiefEditor` | `any` | `userService.getChiefEditor()` | ⚠️ Declared but not used in the component |
| `chiefEditorPosts` | `Post[]` | `postsService.getChiefEditorPosts(15)` — first 5 | ⚠️ Declared but not used in the component |

### Post fields used
- `sliderPosts`: `title`, `summary`, `image`, `categoryName`, `categorySlug`, `slug`, `authorName`
- `rightDirectionPosts`: `title`, `summary`, `image`, `categoryName`, `categorySlug`, `slug`, `authorName`, `authorImage`, `createdBy`
- `leftDirectionPosts`: `title`, `image`, `categoryName`, `categorySlug`, `slug`

---

## DualSwiperLayout (`newsletter-grid`)

Two stacked Swiper rows, each showing 4 slides at a time on desktop.

| Prop | Type | Source | Description |
|------|------|--------|-------------|
| `posts` | `Post[]` | `postsService.getPostsByCategory(slug, { pageSize: 15 })` | Up to 15 posts from the category |

### Post slots
- `posts[0..9]` → first Swiper row (up to 10 slides, 4 visible at a time on desktop, 2 on mobile/tablet)
- `posts[4..7]` → second Swiper row (4 slides, same breakpoints)

### Post fields used
- `title`, `summary`, `image`, `categorySlug`, `slug`

---

## BalancedColumnsLayout (`balanced-columns`)

| Prop | Type | Source | Description |
|------|------|--------|-------------|
| `categoryData.category` | `{ name: string }` | Category object | Category name (declared but not rendered) |
| `categoryData.posts` | `Post[]` | `postsService.getPostsByCategory(slug, { pageSize: 15 })` | Needs at least 11 posts |

### Post slots
- `posts[0..2]` → left column (3 small text articles)
- `posts[3]` → center featured article (title, summary, image)
- `posts[4..6]` → right column (3 small text articles)
- `posts[7..10]` → bottom 4-column row

### Post fields used
- `title`, `summary`, `image`, `categorySlug`, `slug`

---

## FeaturedWithRowLayout (`featured-with-row`)

| Prop | Type | Source | Description |
|------|------|--------|-------------|
| `categoryData.category` | `{ name: string }` | Category object | Declared but not rendered |
| `categoryData.posts` | `Post[]` | `postsService.getPostsByCategory(slug, { pageSize: 15 })` | Needs at least 5 posts |

### Post slots
- `posts[0]` → top featured article (image left, text right — 2-column split)
- `posts[1..4]` → bottom 4-column row (title + summary only)

### Post fields used
- `title`, `summary`, `image`, `categorySlug`, `slug`

---

## DualFeaturedLayout (`dual-featured`)

| Prop | Type | Source | Description |
|------|------|--------|-------------|
| `posts` | `Post[]` | `postsService.getPostsByCategory(slug, { pageSize: 15 })` | Needs at least 6 posts |

### Post slots
- `posts[0..1]` → top 2 featured articles (title, summary, image — centered)
- `posts[2..5]` → bottom 4-column row (title + summary only)

### Post fields used
- `title`, `summary`, `image`, `categorySlug`, `slug`

---

## SplitHeroLayout (`split-hero`)

| Prop | Type | Source | Description |
|------|------|--------|-------------|
| `posts` | `Post[]` | `postsService.getPostsByCategory(slug, { pageSize: 15 })` | Needs at least 6 posts |

### Post slots
- `posts[0]` → left column: text-only (title + summary, no image)
- `posts[2]` → right column: image-only (no text) ⚠️ index 2, not 1
- `posts[2..5]` → bottom 4-column row (title + summary only)

### Post fields used
- `title`, `summary`, `image`, `categorySlug`, `slug`

---

## InvertedSplitLayout (`inverted-split`)

| Prop | Type | Source | Description |
|------|------|--------|-------------|
| `categoryData.category` | `{ name: string }` | Category object | Not rendered |
| `categoryData.posts` | `Post[]` | `postsService.getPostsByCategory(slug, { pageSize: 15 })` | Needs at least 6 posts |

### Post slots
- `posts[0]` → left column: image-only (no text)
- `posts[1]` → right column: text-only (title + summary, no image)
- `posts[2..5]` → bottom 4-column row (title + summary only)

### Post fields used
- `title`, `summary`, `image`, `categorySlug`, `slug`

---

## TripleColumnLayout (`triple-column`)

| Prop | Type | Source | Description |
|------|------|--------|-------------|
| `categoryData.category` | `{ name: string }` | Category object | Not rendered |
| `categoryData.posts` | `Post[]` | `postsService.getPostsByCategory(slug, { pageSize: 15 })` | Uses first 3 posts |
| `showAdvertisement` | `boolean` | `isLast` flag from home.tsx | `true` only for the last category section on the page |
| `advertisementImage` | `string?` | Not passed currently | Optional ad image URL; falls back to a placeholder `AD` block |

### Post slots
- `posts[0..2]` → 3-column grid (title, summary, image at bottom)

### Post fields used
- `title`, `summary`, `image`, `categorySlug`, `slug`

---

## Summary Table

| Layout | Backend ID | Posts prop | Min posts needed | `isSlider` / special flags |
|--------|-----------|------------|-----------------|---------------------------|
| HeroSliderLayout | `hero-slider` | `sliderPosts` + `rightDirectionPosts` + `leftDirectionPosts` | slider: 1+, right: 1+, left: 1+ | `sliderPosts` IS the slider |
| DualSwiperLayout | `newsletter-grid` | `posts` | 5+ (8 for full layout) | two stacked Swiper rows |
| BalancedColumnsLayout | `balanced-columns` | `categoryData.posts` | 11 | none |
| FeaturedWithRowLayout | `featured-with-row` | `categoryData.posts` | 5 | none |
| DualFeaturedLayout | `dual-featured` | `posts` | 6 | none |
| SplitHeroLayout | `split-hero` | `posts` | 6 | none |
| InvertedSplitLayout | `inverted-split` | `categoryData.posts` | 6 | none |
| TripleColumnLayout | `triple-column` | `categoryData.posts` | 3 | `showAdvertisement=true` when it's the last section |
