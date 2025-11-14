# Al-Qabas News Website - Remix Project

A modern Arabic news website built with **React Router (Remix v2)**, **TypeScript**, and **Tailwind CSS**.

## Project Structure

```
alqabas-remix/
├── app/
│   ├── components/
│   │   ├── Header.tsx          # Navigation header with RTL support
│   │   └── Footer.tsx          # Footer component
│   ├── routes/
│   │   ├── home.tsx            # Homepage with featured stories and grids
│   │   ├── article.tsx         # Individual article page
│   │   ├── category.tsx        # Category page with filtered articles
│   │   └── search.tsx          # Search results page
│   ├── app.css                 # Global styles with Tailwind
│   ├── root.tsx                # Root layout with RTL support
│   └── routes.ts               # Route configuration
├── public/                     # Static assets
├── tailwind.config.ts          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

## Features

✅ **RTL (Right-to-Left) Support** - Full Arabic language support with RTL layout
✅ **Responsive Design** - Mobile-first approach with Tailwind CSS
✅ **Modern UI** - Beautiful gradient headers, cards, and hover effects
✅ **Multiple Pages**:
  - Homepage with featured stories and category grids
  - Article detail pages
  - Category pages with filtered content
  - Search functionality
✅ **TypeScript** - Full type safety
✅ **Fast Development** - Vite-powered hot module replacement

## Pages Included

### 1. **Homepage** (`/`)
- Featured story with large image and overlay text
- Side stories grid
- Category shortcuts with icons
- News grid (4 columns on desktop)
- Recent articles list
- Newsletter subscription section

### 2. **Article Page** (`/article/:id`)
- Full article content with metadata
- Author and date information
- Related articles sidebar
- Comments section
- Share buttons
- Newsletter signup

### 3. **Category Page** (`/category/:slug`)
Available categories:
- محليات (Local)
- اقتصاد (Economy)
- رياضة (Sports)
- فن وثقافة (Culture)
- تقنية (Tech)
- القبس الدولي (International)
- فيديوهات (Videos)
- بودكاست (Podcasts)

Features:
- Filtered articles by category
- Sort options (Latest, Most Read, Most Commented)
- Pagination
- Article count display

### 4. **Search Page** (`/search?q=query`)
- Search functionality with query parameter
- Results display
- Popular searches suggestions
- No results handling

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd /home/karim/Desktop/Al-Qabas/alqabas-remix
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173/`

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Technologies Used

- **React Router v7** - Modern routing and data loading
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Next generation frontend tooling
- **PostCSS** - CSS processing with Autoprefixer

## Styling

### RTL Support
- HTML element has `dir="rtl"` and `lang="ar"`
- Tailwind CSS handles RTL automatically
- All components are RTL-aware

### Arabic Fonts
- Primary font: **Cairo** (Google Fonts)
- Fallback fonts: Segoe UI, Tahoma, Arial
- Configured in `tailwind.config.ts`

### Color Scheme
- Primary Blue: `#0066CC` (qabas-blue)
- Dark Blue: `#003366` (qabas-dark)
- Gradients for headers and CTAs

## Component Architecture

### Header Component
- Top bar with login/subscription links
- Logo and search bar
- Navigation menu with all categories
- Sticky positioning

### Footer Component
- About section
- Category links
- Services links
- Social media links
- Copyright information

## Data Structure

Currently using sample data in route components. To integrate with a real API:

1. Create a `lib/api.ts` file for API calls
2. Use React Router's loader functions to fetch data
3. Update route components to use loader data

Example:
```typescript
export async function loader({ params }: Route.LoaderArgs) {
  const article = await fetchArticle(params.id);
  return { article };
}
```

## Customization

### Adding New Categories
1. Update `Header.tsx` categories array
2. Add category data to `categoryArticles` in `category.tsx`
3. Update `categoryNames` mapping

### Changing Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  'qabas-blue': '#YOUR_COLOR',
  'qabas-dark': '#YOUR_COLOR',
}
```

### Adding Images
Replace placeholder images from Unsplash with your own:
- Update `image` URLs in route components
- Store images in `public/` folder
- Reference with `/image-name.jpg`

## Performance Tips

- Images are optimized with `object-cover` and `object-fit`
- Lazy loading can be added with `loading="lazy"` attribute
- Consider implementing image optimization library
- Use React Router's prefetching for faster navigation

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- [ ] Backend API integration
- [ ] User authentication
- [ ] Comments system
- [ ] Favorites/Bookmarks
- [ ] Dark mode toggle
- [ ] Progressive Web App (PWA)
- [ ] Image optimization
- [ ] Analytics integration
- [ ] SEO optimization
- [ ] Internationalization (i18n)

## Deployment

### Netlify
```bash
npm run build
# Deploy the dist/ folder
```

### Vercel
```bash
npm run build
# Connect your GitHub repo to Vercel
```

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please create an issue in the repository.
