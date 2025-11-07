# i18next & Lucide Integration Setup

## What Was Installed

- **lucide-react** - Modern icon library with 1000+ icons
- **i18next** - Internationalization framework
- **react-i18next** - React bindings for i18next

## Project Structure

```
src/
├── i18n/
│   ├── config.ts              # i18next configuration
│   └── locales/
│       ├── en.json            # English translations
│       └── ar.json            # Arabic translations
├── contexts/
│   └── LanguageContext.tsx    # Updated to use i18next
├── components/
│   ├── LanguageToggle/
│   │   └── LanguageToggle.tsx # Now uses Lucide Globe icon
│   └── Common/
│       └── I18nExample.tsx    # Example usage
└── main.tsx                   # i18n initialized here
```

## How to Use

### 1. Using Translations in Components

```tsx
import { useTranslation } from 'react-i18next';

export default function MyComponent() {
  const { t, i18n } = useTranslation();
  
  return (
    <div>
      <h1>{t('app.name')}</h1>
      <p>Current language: {i18n.language}</p>
    </div>
  );
}
```

### 2. Using Lucide Icons

```tsx
import { Globe, Home, Settings, LogOut, Search } from 'lucide-react';

export default function IconExample() {
  return (
    <div>
      <Globe className="w-5 h-5" />
      <Home className="w-5 h-5" />
      <Settings className="w-5 h-5" />
      <LogOut className="w-5 h-5" />
      <Search className="w-5 h-5" />
    </div>
  );
}
```

### 3. Toggling Language

Use the existing `LanguageToggle` component or the `useLanguage` hook:

```tsx
import { useLanguage } from '@/contexts/LanguageContext';

export default function MyComponent() {
  const { language, toggleLanguage, t } = useLanguage();
  
  return (
    <button onClick={toggleLanguage}>
      Switch to {language === 'en' ? 'Arabic' : 'English'}
    </button>
  );
}
```

## Translation Structure

Translations are organized hierarchically in JSON files:

```json
{
  "auth": {
    "login": "Login",
    "register": "Register"
  },
  "dashboard": {
    "home": "Dashboard",
    "posts": "Posts"
  }
}
```

Access with dot notation: `t('auth.login')`

## Adding New Translations

1. Add the key to both `src/i18n/locales/en.json` and `src/i18n/locales/ar.json`
2. Use `t('your.new.key')` in your components
3. The translation will automatically update across the app

## Features

✅ Automatic RTL/LTR switching based on language  
✅ Persistent language preference in localStorage  
✅ 1000+ Lucide icons available  
✅ Nested translation keys  
✅ Easy language toggling  
✅ Type-safe with TypeScript  

## Available Lucide Icons

Some popular icons:
- `Globe`, `Globe2` - Language/world
- `Home`, `LayoutDashboard` - Navigation
- `Settings`, `Sliders` - Configuration
- `LogOut`, `LogIn` - Auth
- `Search`, `Filter` - Search/Filter
- `Plus`, `Trash2`, `Edit` - CRUD
- `AlertCircle`, `CheckCircle` - Status
- `Menu`, `X` - Mobile menu

See full list: https://lucide.dev/

## Example Component

See `src/components/Common/I18nExample.tsx` for a working example combining i18next and Lucide icons.
