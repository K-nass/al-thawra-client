# Admin Dashboard & Post Creation Translations

## Overview
Complete English and Arabic translations have been added to the admin dashboard and post creation forms using i18next.

## Updated Components

### Dashboard Sidebar
- **File**: `src/components/Admin/Dashboard/DashboardSidebar/DashboardSidebar.tsx`
- **Changes**:
  - Converted hardcoded labels to translation keys
  - All menu items now use `labelKey` with i18next translations
  - Admin panel title uses `t('dashboard.adminPanel')`

### Dashboard Profile Card
- **File**: `src/components/Admin/Dashboard/DashboardSidebar/DashboardProfileCard/DashboardProfileCard.tsx`
- **Changes**:
  - "online" status now uses `t('common.online')`

### Dashboard Posts List
- **File**: `src/components/Admin/Dashboard/DashboardPosts/DashboardPosts.tsx`
- **Changes**:
  - Filter labels: Show, Language, Post Type, Category, Subcategory, User, Search
  - Table headers: ID, Posts, Language, Type, Category, Author, Views, Date, Options
  - "Add Post" button uses `t('post.addPost')`
  - "Manage" button uses `t('common.manage')`
  - All dropdown options translated (All, Article, Video, English, Arabic)

### Post Form Header
- **File**: `src/components/Admin/Dashboard/DashboardAddPost/DashboardForm/FormHeader.tsx`
- **Changes**:
  - "Add Post" title uses `t('post.addPost')`
  - "Posts" button uses `t('post.posts')`

### Publish Section
- **File**: `src/components/Admin/Dashboard/DashboardAddPost/DashboardForm/PublishSection.tsx`
- **Changes**:
  - "Publish" heading uses `t('post.publish')`
  - "Scheduled Post" checkbox uses `t('post.scheduledPost')`
  - "Save as Draft" button uses `t('post.saveAsDraft')`
  - "Submit" button uses `t('post.publishPost')`

### Post Details Form
- **File**: `src/components/Admin/Dashboard/DashboardAddPost/DashboardForm/PostDetailsForm.tsx`
- **Changes**:
  - "Post Details" heading uses `t('post.postDetails')`
  - "Title" label uses `t('post.title')`
  - "Slug" label uses `t('post.slug')`
  - Slug hint uses `t('post.slugHint')`
  - "Description" label uses `t('post.description')`

## Translation Keys Added

### Dashboard Keys
```json
"dashboard": {
  "navigation": "Navigation",
  "themes": "Themes",
  "pages": "Pages",
  "bulkPostUpload": "Bulk Post Upload",
  "categories": "Categories",
  "tags": "Tags",
  "adminPanel": "Admin Panel"
}
```

### Common Keys
```json
"common": {
  "online": "online",
  "manage": "Manage",
  "show": "Show",
  "all": "All",
  "select": "Select"
}
```

### Post Keys
```json
"post": {
  "addPost": "Add Post",
  "posts": "Posts",
  "postDetails": "Post Details",
  "title": "Title",
  "slug": "Slug",
  "slugHint": "If you leave it blank, it will be generated automatically.",
  "description": "Description",
  "content": "Content",
  "category": "Category",
  "subcategory": "Subcategory",
  "tags": "Tags",
  "language": "Language",
  "english": "English",
  "arabic": "Arabic",
  "image": "Image",
  "imageDescription": "Image Description",
  "additionalImages": "Additional Images",
  "gallery": "Gallery",
  "sortedList": "Sorted List",
  "publish": "Publish",
  "publishPost": "Submit",
  "saveAsDraft": "Save as Draft",
  "scheduledPost": "Scheduled Post",
  "author": "Author",
  "views": "Views",
  "date": "Date",
  "type": "Type",
  "article": "Article",
  "video": "Video",
  "user": "User",
  "id": "Id",
  "options": "Options",
  "createdBy": "Created by"
}
```

### Filter Keys
```json
"filter": {
  "show": "Show",
  "language": "Language",
  "postType": "Post Type",
  "category": "Category",
  "subcategory": "Subcategory",
  "user": "User",
  "search": "Search"
}
```

## Arabic Translations
All keys have corresponding Arabic translations in `src/i18n/locales/ar.json`:
- Dashboard items translated to Arabic
- Form labels and buttons translated
- Filter options translated
- All UI text is now bilingual

## Language Switching
The entire admin dashboard and post creation interface automatically switches between English and Arabic when the language toggle is used. The interface maintains:
- ✅ RTL/LTR layout switching
- ✅ All text translations
- ✅ Persistent language preference
- ✅ Smooth transitions

## How to Add More Translations
1. Add the key to both `src/i18n/locales/en.json` and `src/i18n/locales/ar.json`
2. Use `const { t } = useTranslation()` in your component
3. Replace hardcoded text with `t('key.path')`

Example:
```tsx
import { useTranslation } from "react-i18next";

export default function MyComponent() {
  const { t } = useTranslation();
  
  return <button>{t('common.save')}</button>;
}
```

## Files Modified
1. `src/i18n/locales/en.json` - Added 50+ new English translations
2. `src/i18n/locales/ar.json` - Added 50+ new Arabic translations
3. `src/components/Admin/Dashboard/DashboardSidebar/DashboardSidebar.tsx`
4. `src/components/Admin/Dashboard/DashboardSidebar/DashboardProfileCard/DashboardProfileCard.tsx`
5. `src/components/Admin/Dashboard/DashboardPosts/DashboardPosts.tsx`
6. `src/components/Admin/Dashboard/DashboardAddPost/DashboardForm/FormHeader.tsx`
7. `src/components/Admin/Dashboard/DashboardAddPost/DashboardForm/PublishSection.tsx`
8. `src/components/Admin/Dashboard/DashboardAddPost/DashboardForm/PostDetailsForm.tsx`

## Testing
To test the translations:
1. Navigate to the admin dashboard
2. Use the language toggle button (top-right corner)
3. Verify all text switches between English and Arabic
4. Check that RTL/LTR layout adjusts properly for Arabic
