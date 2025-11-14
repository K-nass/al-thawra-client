# Deployment Guide

## Pre-Deployment Checklist

- [ ] Replace sample data with real API integration
- [ ] Update all image URLs to production images
- [ ] Test all routes and pages
- [ ] Verify RTL layout on mobile devices
- [ ] Update meta tags and SEO information
- [ ] Add analytics tracking (Google Analytics, etc.)
- [ ] Set up error logging (Sentry, etc.)
- [ ] Configure environment variables
- [ ] Test on different browsers

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=https://api.example.com
VITE_SITE_NAME=القبس
VITE_SITE_URL=https://alqabas.com
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Building for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized production build.

## Deployment Options

### 1. Netlify (Recommended)

**Option A: Connect GitHub**
1. Push code to GitHub
2. Go to https://netlify.com
3. Click "New site from Git"
4. Select your repository
5. Build command: `npm run build`
6. Publish directory: `dist`
7. Deploy!

**Option B: Manual Deploy**
```bash
npm run build
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### 2. Vercel

**Option A: Connect GitHub**
1. Push code to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Import your repository
5. Framework: React Router
6. Deploy!

**Option B: CLI**
```bash
npm install -g vercel
npm run build
vercel --prod
```

### 3. AWS Amplify

```bash
npm install -g @aws-amplify/cli
amplify init
amplify add hosting
amplify publish
```

### 4. Docker (Self-hosted)

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t alqabas .
docker run -p 3000:3000 alqabas
```

### 5. Traditional Server (Apache/Nginx)

1. Build the project:
```bash
npm run build
```

2. Upload `dist/` folder to your server

3. Configure server to serve `dist/index.html` for all routes

**Nginx config:**
```nginx
server {
    listen 80;
    server_name alqabas.com;
    root /var/www/alqabas/dist;
    
    location / {
        try_files $uri /index.html;
    }
}
```

**Apache config (.htaccess):**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Domain Setup

### DNS Configuration
Point your domain to your hosting provider:

**For Netlify:**
- CNAME: `your-site.netlify.app`

**For Vercel:**
- CNAME: `cname.vercel-dns.com`

**For AWS:**
- Use Route 53 or point to CloudFront distribution

## SSL/HTTPS

Most hosting providers (Netlify, Vercel) provide free SSL certificates.

For self-hosted:
- Use Let's Encrypt: https://letsencrypt.org
- Install Certbot: `sudo apt install certbot`
- Generate certificate: `sudo certbot certonly --standalone -d alqabas.com`

## Performance Optimization

### 1. Image Optimization
```bash
npm install -D sharp
```

Use in build process or consider services like:
- Cloudinary
- ImageKit
- AWS CloudFront

### 2. Caching Headers
Set in your server configuration:
```
Cache-Control: public, max-age=31536000
```

### 3. CDN
Use a CDN to serve static assets:
- Cloudflare (free)
- AWS CloudFront
- Bunny CDN

### 4. Compression
Enable gzip compression on your server:

**Nginx:**
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

## Monitoring & Analytics

### Google Analytics
Add to `root.tsx`:
```typescript
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### Error Tracking (Sentry)
```bash
npm install @sentry/react
```

### Performance Monitoring
- Google PageSpeed Insights
- GTmetrix
- WebPageTest

## Continuous Deployment

### GitHub Actions
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=dist
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Backup & Recovery

1. Regular backups of database (if using)
2. Version control with Git
3. Keep deployment logs
4. Document any manual configurations

## Security Checklist

- [ ] Remove debug information
- [ ] Set secure headers (CORS, CSP)
- [ ] Validate all user inputs
- [ ] Use HTTPS only
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Set up WAF (Web Application Firewall)

## Post-Deployment

1. Test all pages and functionality
2. Check mobile responsiveness
3. Verify RTL layout
4. Test search functionality
5. Check category filtering
6. Verify article links
7. Test newsletter signup
8. Monitor error logs
9. Check analytics
10. Get user feedback

## Rollback Procedure

If issues occur:

**Netlify:**
1. Go to Deploys
2. Click on previous successful deploy
3. Click "Publish deploy"

**Vercel:**
1. Go to Deployments
2. Select previous version
3. Click "Promote to Production"

**Manual:**
1. Keep previous `dist/` backup
2. Restore from backup
3. Restart server

## Support & Troubleshooting

### Common Issues

**Blank page:**
- Check browser console for errors
- Verify build completed successfully
- Check server logs

**Styling not loading:**
- Clear browser cache
- Check CSS file paths
- Verify Tailwind build

**Routes not working:**
- Check server rewrite rules
- Verify route configuration
- Check for 404 errors

**Images not loading:**
- Verify image URLs
- Check CORS settings
- Verify file permissions

## Contact & Support

- Documentation: See PROJECT_SETUP.md
- React Router: https://reactrouter.com
- Tailwind: https://tailwindcss.com
- Hosting Support: Check your provider's docs
