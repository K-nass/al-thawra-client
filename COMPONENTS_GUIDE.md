# Al-Qabas Components Guide

This guide explains the reusable components created for the Al-Qabas website homepage.

## Components Overview

### 1. **TopBar** (`components/TopBar.tsx`)
Displays editor information and breaking news at the top of the page.

**Features:**
- Editor names and titles
- PDF download link
- Breaking news alert
- Social media links (email, YouTube, Twitter, etc.)

**Usage:**
```tsx
import TopBar from "../components/TopBar";

export default function Page() {
  return <TopBar />;
}
```

---

### 2. **MainNav** (`components/MainNav.tsx`)
Primary navigation bar with logo and main menu items.

**Features:**
- Logo display
- Navigation menu (الرئيسية, ماستر كلاس, تلفزيون, etc.)
- Search button
- Login and subscription buttons
- Responsive design

**Usage:**
```tsx
import MainNav from "../components/MainNav";

export default function Page() {
  return <MainNav />;
}
```

---

### 3. **CategoryNav** (`components/CategoryNav.tsx`)
Secondary navigation for article categories.

**Features:**
- Category links (محليات, اقتصاد, etc.)
- "More" dropdown indicator
- Responsive layout

**Usage:**
```tsx
import CategoryNav from "../components/CategoryNav";

export default function Page() {
  return <CategoryNav />;
}
```

---

### 4. **FeaturedArticle** (`components/FeaturedArticle.tsx`)
Large featured section with video and main article.

**Props:**
```tsx
interface FeaturedArticleProps {
  videoImage: string;        // Video thumbnail image URL
  videoTitle: string;        // Video title
  videoCategory: string;     // Video category label
  title: string;             // Main article title
  category: string;          // Article category
  description: string;       // Article description
  date: string;              // Publication date
  sideImage: string;         // Side featured image
}
```

**Usage:**
```tsx
import FeaturedArticle from "../components/FeaturedArticle";

const data = {
  videoImage: "https://...",
  videoTitle: "سوريا بعد سقوط بشار الأسد",
  videoCategory: "عمار مع النفيسي",
  title: "تكريم أميري لمعلمي الأجيال",
  category: "محليات",
  description: "تقديراً لدورهم البارز...",
  date: "11 نوفمبر 2025",
  sideImage: "https://...",
};

export default function Page() {
  return <FeaturedArticle {...data} />;
}
```

---

### 5. **ArticleCard** (`components/ArticleCard.tsx`)
Reusable card component for displaying articles.

**Props:**
```tsx
interface ArticleCardProps {
  image: string;              // Article image URL
  category: string;           // Category label
  title?: string;             // Article title (optional)
  description?: string;       // Article description (optional)
  isAppPromo?: boolean;       // Show as app promotion card
  bgColor?: string;           // Background color (e.g., "bg-green-500")
  flagImage?: string;         // Country flag image (optional)
}
```

**Variants:**

1. **Standard Card:**
```tsx
<ArticleCard
  image="https://..."
  category="محليات"
/>
```

2. **App Promotion Card:**
```tsx
<ArticleCard
  image="https://..."
  category="محليات"
  description="أخبار محلية وعالمية، وتقارير خاصة من القبس"
  isAppPromo={true}
  bgColor="bg-green-500"
/>
```

3. **Portrait Card (Blue Background):**
```tsx
<ArticleCard
  image="https://..."
  category="محليات"
  bgColor="bg-blue-400"
/>
```

4. **Card with Flag:**
```tsx
<ArticleCard
  image="https://..."
  category="محليات"
  flagImage="https://..."
/>
```

---

### 6. **NewsSection** (`components/NewsSection.tsx`)
Container for displaying a grid of article cards with a section title.

**Props:**
```tsx
interface NewsSectionProps {
  title: string;              // Section title
  articles: Article[];        // Array of articles
  showViewMore?: boolean;     // Show "view more" link
}

interface Article {
  id: string;
  image: string;
  category: string;
  title?: string;
  description?: string;
  isAppPromo?: boolean;
  bgColor?: string;
  flagImage?: string;
}
```

**Usage:**
```tsx
import NewsSection from "../components/NewsSection";

const articles = [
  {
    id: "1",
    image: "https://...",
    category: "محليات",
    description: "أخبار محلية وعالمية",
    isAppPromo: true,
    bgColor: "bg-green-500",
  },
  {
    id: "2",
    image: "https://...",
    category: "محليات",
    bgColor: "bg-blue-400",
  },
  // ... more articles
];

export default function Page() {
  return <NewsSection title="محليات" articles={articles} />;
}
```

---

## Color System

The design uses a custom color palette defined in `tailwind.config.ts`:

```tsx
colors: {
  'primary': '#0066CC',                    // Main brand color
  'background-light': '#ffffff',           // Light mode background
  'background-dark': '#1a1a1a',            // Dark mode background
  'card-light': '#f5f5f5',                 // Light mode card background
  'card-dark': '#2a2a2a',                  // Dark mode card background
  'text-light': '#000000',                 // Light mode text
  'text-dark': '#ffffff',                  // Dark mode text
  'text-muted-light': '#666666',           // Light mode muted text
  'text-muted-dark': '#cccccc',            // Dark mode muted text
  'border-light': '#e0e0e0',               // Light mode borders
  'border-dark': '#404040',                // Dark mode borders
}
```

---

## Example: Complete Homepage

```tsx
import TopBar from "../components/TopBar";
import MainNav from "../components/MainNav";
import CategoryNav from "../components/CategoryNav";
import FeaturedArticle from "../components/FeaturedArticle";
import NewsSection from "../components/NewsSection";

export default function Home() {
  const featuredData = {
    videoImage: "https://...",
    videoTitle: "سوريا بعد سقوط بشار الأسد",
    videoCategory: "عمار مع النفيسي",
    title: "تكريم أميري لمعلمي الأجيال",
    category: "محليات",
    description: "تقديراً لدورهم البارز...",
    date: "11 نوفمبر 2025",
    sideImage: "https://...",
  };

  const articles = [
    // ... article data
  ];

  return (
    <>
      <TopBar />
      <MainNav />
      <CategoryNav />
      <main className="bg-background-light dark:bg-background-dark">
        <div className="max-w-screen-2xl mx-auto">
          <div className="container mx-auto px-4 py-8">
            <FeaturedArticle {...featuredData} />
          </div>
          <div className="container mx-auto px-4">
            <NewsSection title="محليات" articles={articles} />
          </div>
        </div>
      </main>
    </>
  );
}
```

---

## Styling Notes

- All components use **Tailwind CSS** with custom color variables
- Components support **dark mode** with `dark:` prefix classes
- **RTL (Right-to-Left)** layout is built-in for Arabic text
- Components are fully **responsive** and mobile-friendly
- Material Icons are used throughout (requires Material Icons font)

---

## Material Icons

Add this to your HTML head to use Material Icons:

```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

---

## Next Steps

1. Connect components to real data from your backend API
2. Add routing/links to article pages
3. Implement search functionality
4. Add more section components as needed
5. Customize colors and styling as per brand guidelines
