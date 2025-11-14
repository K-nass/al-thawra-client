# Quick Start Guide

## What's Been Created

A fully functional **Arabic news website** built with React Router (Remix v2), TypeScript, and Tailwind CSS.

## Project Location
```
/home/karim/Desktop/Al-Qabas/alqabas-remix
```

## Running the Project

### Start Development Server
```bash
cd /home/karim/Desktop/Al-Qabas/alqabas-remix
npm run dev
```

Then open: **http://localhost:5173**

## Pages Available

| Page | URL | Description |
|------|-----|-------------|
| Homepage | `/` | Featured stories, categories, news grid |
| Article | `/article/1` | Full article with comments & related |
| Category | `/category/local` | Filtered news by category |
| Search | `/search?q=test` | Search results |

## Category Slugs
- `local` - محليات
- `economy` - اقتصاد
- `sports` - رياضة
- `culture` - فن وثقافة
- `tech` - تقنية
- `international` - القبس الدولي
- `videos` - فيديوهات
- `podcasts` - بودكاست

## Key Features

✅ **RTL Layout** - Full Arabic support with right-to-left text
✅ **Responsive Design** - Mobile, tablet, desktop optimized
✅ **Modern UI** - Gradient headers, cards, hover effects
✅ **TypeScript** - Type-safe code
✅ **Tailwind CSS** - Utility-first styling
✅ **Sample Data** - Ready to replace with real API

## Project Structure

```
app/
├── components/
│   ├── Header.tsx      ← Navigation with categories
│   └── Footer.tsx      ← Footer links
├── routes/
│   ├── home.tsx        ← Homepage
│   ├── article.tsx     ← Article detail
│   ├── category.tsx    ← Category page
│   └── search.tsx      ← Search page
├── root.tsx            ← Root layout (RTL setup)
└── app.css             ← Global styles
```

## Customization

### Change Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  'qabas-blue': '#YOUR_COLOR',
}
```

### Add New Categories
1. Edit `Header.tsx` - add to categories array
2. Edit `category.tsx` - add to categoryArticles object
3. Edit `routes.ts` - route will work automatically

### Replace Images
Replace Unsplash URLs with your own images in:
- `app/routes/home.tsx`
- `app/routes/article.tsx`
- `app/routes/category.tsx`

## Build for Production

```bash
npm run build
npm start
```

## Deploy

### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Vercel
```bash
# Connect GitHub repo to Vercel
# Auto-deploys on push
```

## Next Steps

1. **Replace Sample Data** - Connect to your API
2. **Add Real Images** - Replace Unsplash URLs
3. **Customize Colors** - Match your brand
4. **Add More Pages** - Videos, Podcasts, etc.
5. **Setup Analytics** - Track user behavior
6. **Add Authentication** - User accounts

## Useful Commands

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Type check
npm run type-check

# Format code
npm run format
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Need Help?

- Check `PROJECT_SETUP.md` for detailed documentation
- Review component files for code examples
- React Router docs: https://reactrouter.com
- Tailwind CSS docs: https://tailwindcss.com

---

**Happy coding! 🚀**
