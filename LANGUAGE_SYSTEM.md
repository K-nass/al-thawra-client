# Language Toggle System

## Overview
The application now supports English and Arabic with a toggle button. The system includes:
- Automatic RTL/LTR text direction switching
- Persistent language preference (saved in localStorage)
- Translation system for all UI text
- Language toggle button in all layouts

## How It Works

### 1. Language Context (`src/contexts/LanguageContext.tsx`)
- Manages language state (English or Arabic)
- Provides `t()` function for translations
- Automatically sets `dir` attribute on HTML element (rtl/ltr)
- Saves preference to localStorage

### 2. Language Toggle Button (`src/components/LanguageToggle/LanguageToggle.tsx`)
- Click to switch between English and Arabic
- Two variants: `light` (for auth pages) and `dark` (for dashboard)
- Shows opposite language name (e.g., shows "العربية" when in English)

### 3. Using Translations in Components

```tsx
import { useLanguage } from '@/contexts/LanguageContext';

function MyComponent() {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('auth.login')}</h1>
      <button>{t('common.submit')}</button>
    </div>
  );
}
```

## Available Translation Keys

### Authentication
- `auth.login` - "Login" / "تسجيل الدخول"
- `auth.register` - "Register" / "التسجيل"
- `auth.email` - "Email Address" / "البريد الإلكتروني"
- `auth.password` - "Password" / "كلمة المرور"
- `auth.confirmPassword` - "Confirm Password" / "تأكيد كلمة المرور"
- `auth.name` - "Name" / "الاسم"
- `auth.loggingIn` - "Logging in..." / "جاري تسجيل الدخول..."
- `auth.registering` - "Registering..." / "جاري التسجيل..."
- `auth.loginSuccess` - "Login successful!" / "تم تسجيل الدخول بنجاح!"
- `auth.noAccount` - "Don't have an account?" / "ليس لديك حساب؟"
- `auth.hasAccount` - "Already have an account?" / "لديك حساب بالفعل؟"
- `auth.registerHere` - "Register here" / "سجل هنا"
- `auth.loginHere` - "Login here" / "سجل الدخول هنا"
- `auth.adminLogin` - "Admin Login" / "تسجيل دخول المشرف"

### Dashboard
- `dashboard.home` - "Dashboard" / "لوحة التحكم"
- `dashboard.posts` - "Posts" / "المقالات"
- `dashboard.allPosts` - "All Posts" / "جميع المقالات"
- `dashboard.addPost` - "Add Post" / "إضافة مقال"
- `dashboard.postFormat` - "Post Format" / "تنسيق المقال"
- `dashboard.sliderPosts` - "Slider Posts" / "مقالات السلايدر"
- `dashboard.featuredPosts` - "Featured Posts" / "المقالات المميزة"
- `dashboard.breakingNews` - "Breaking News" / "الأخبار العاجلة"
- `dashboard.logout` - "Logout" / "تسجيل الخروج"

### Common
- `common.loading` - "Loading..." / "جاري التحميل..."
- `common.save` - "Save" / "حفظ"
- `common.cancel` - "Cancel" / "إلغاء"
- `common.delete` - "Delete" / "حذف"
- `common.edit` - "Edit" / "تعديل"
- `common.search` - "Search" / "بحث"
- `common.filter` - "Filter" / "تصفية"
- `common.submit` - "Submit" / "إرسال"

### App
- `app.name` - "Al-Thawra" / "جريدة الثورة"
- `app.nameAlt` - "Al-Qabas" / "القبس"

## Adding New Translations

To add new translations, edit `src/contexts/LanguageContext.tsx`:

1. Add to `enTranslations` object:
```typescript
'myKey.myValue': 'English Text',
```

2. Add to `arTranslations` object:
```typescript
'myKey.myValue': 'النص العربي',
```

3. Use in components:
```tsx
{t('myKey.myValue')}
```

## Where Language Toggle Appears

1. **Login Page** - Top right corner
2. **Register Page** - Top right corner
3. **Dashboard Sidebar** - Above logout button

## RTL Support

When Arabic is selected:
- `document.documentElement.dir` is set to `"rtl"`
- `document.documentElement.lang` is set to `"ar"`
- TailwindCSS automatically handles RTL layout

When English is selected:
- `document.documentElement.dir` is set to `"ltr"`
- `document.documentElement.lang` is set to `"en"`

## Styling Notes

- The language toggle uses two variants:
  - **Light variant**: White text on semi-transparent background (for auth pages)
  - **Dark variant**: Gray background (for dashboard sidebar)
- Text is hidden on mobile for space efficiency
- Icon remains visible on all screen sizes
