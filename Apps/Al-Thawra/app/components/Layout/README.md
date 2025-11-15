# Layout Components

This directory contains reusable layout components for the Al-Qabas website.

## Components

### Header
The main header component with three sections:
- **Top Info Bar**: Editor information and PDF download link
- **Main Header**: Logo, navigation menu, and action buttons
- **Categories Navigation**: Category links with hover effects

**File**: `Header.tsx`

**Features**:
- Sticky positioning at the top of the page
- Responsive design (mobile and desktop)
- RTL support for Arabic text
- Smooth transitions and hover effects
- Navigation to login page
- Search button functionality

**Usage**:
```tsx
import { Header } from "@/components/Layout";

export function MyPage() {
  return (
    <>
      <Header />
      {/* Your page content */}
    </>
  );
}
```

### Footer
The main footer component with:
- **Logo and Social Media**: Al-Qabas branding with links to social platforms
- **Navigation Links**: Links to important pages (About, Subscriptions, Privacy, etc.)
- **Scroll to Top Button**: Floating button to scroll back to top

**File**: `Footer.tsx`

**Features**:
- Dark theme with hover effects
- Social media icons (Telegram, YouTube, Twitter, Facebook, Instagram, LinkedIn, TikTok, WhatsApp)
- Responsive layout
- Smooth scroll-to-top animation
- Dynamic year in copyright notice
- RTL support

**Usage**:
```tsx
import { Footer } from "@/components/Layout";

export function MyPage() {
  return (
    <>
      {/* Your page content */}
      <Footer />
    </>
  );
}
```

### Layout (Wrapper)
A complete layout wrapper that combines Header and Footer with proper flex layout.

**File**: `Layout.tsx`

**Features**:
- Combines Header, Footer, and main content
- Ensures footer sticks to bottom with `min-h-screen`
- Proper flex layout for responsive design

**Usage**:
```tsx
import { Layout } from "@/components/Layout";

export function MyPage() {
  return (
    <Layout>
      {/* Your page content goes here */}
    </Layout>
  );
}
```

## Global Usage

The Layout component is already integrated into the root layout of the application. All pages automatically get the Header and Footer without any additional setup.

**File**: `app/root.tsx`

```tsx
export default function App() {
  return (
    <PageLayout>
      <Outlet />
    </PageLayout>
  );
}
```

This means:
- ✅ Header appears on all pages automatically
- ✅ Footer appears on all pages automatically
- ✅ No need to import Layout in individual pages
- ✅ All pages have consistent styling

## Customization

### Header Navigation Links
Edit the navigation links in `Header.tsx` (lines 65-100):
```tsx
<a className="hover:text-gray-200 transition-colors" href="#">
  Your Link
</a>
```

### Footer Links
Edit the footer navigation links in `Footer.tsx` (lines 117-145):
```tsx
<a className="text-gray-300 hover:text-white transition-colors" href="#">
  Your Link
</a>
```

### Social Media Links
Update the social media URLs in `Footer.tsx` (lines 38-120):
```tsx
<a href="https://your-social-media-url" aria-label="Platform Name">
  {/* SVG Icon */}
</a>
```

### Styling
All components use Tailwind CSS classes. To modify colors:
- Primary color: Change `bg-primary` to your desired color
- Text colors: Modify `text-gray-*` classes
- Hover effects: Update `hover:*` classes

## Responsive Breakpoints

Both Header and Footer are responsive:
- **Mobile**: Single column layout, stacked navigation
- **Tablet & Desktop**: Multi-column layout with full navigation

Breakpoint used: `md:` (768px and above)

## Accessibility

- ✅ Semantic HTML structure
- ✅ ARIA labels on icon buttons
- ✅ Proper heading hierarchy
- ✅ Keyboard navigation support
- ✅ Color contrast compliance

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Dependencies

- React Router (for navigation)
- Tailwind CSS (for styling)
- Material Symbols (for icons)

## Notes

- The Header has a sticky position, so it stays at the top while scrolling
- The Footer has a scroll-to-top button that smoothly animates
- Both components support dark mode with `dark:` classes
- RTL (Right-to-Left) layout is fully supported for Arabic text
