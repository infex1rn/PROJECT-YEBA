# Cloudflare Pages Deployment Guide for DeepFold Frontend

This guide covers deploying the DeepFold Design Marketplace frontend to Cloudflare Pages.

## Prerequisites

- Cloudflare account
- GitHub repository connected to Cloudflare Pages
- Node.js 20.x or later
- pnpm package manager

## Deployment Methods

### Method 1: Automatic Deployment via Cloudflare Dashboard (Recommended)

1. **Connect to Cloudflare Pages:**
   - Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Go to **Pages** → **Create a project**
   - Click **Connect to Git**
   - Select your GitHub repository: `infex1rn/PROJECT-YEBA`
   - Authorize Cloudflare to access your repository

2. **Configure Build Settings:**
   ```
   Framework preset:           Next.js
   Build command:              cd frontend && pnpm install && pnpm run build
   Build output directory:     frontend/.next
   Root directory:             frontend
   Environment variables:      (See below)
   ```

3. **Set Environment Variables:**
   Go to **Settings** → **Environment variables** and add:
   ```
   NODE_VERSION=20
   NEXT_PUBLIC_API_URL=https://your-backend-api.com
   ```

4. **Deploy:**
   - Click **Save and Deploy**
   - Cloudflare will automatically build and deploy your site
   - You'll get a URL like: `https://deepfold-marketplace.pages.dev`

### Method 2: Deploy via Wrangler CLI

1. **Install Wrangler:**
   ```bash
   npm install -g wrangler
   # or
   pnpm add -g wrangler
   ```

2. **Login to Cloudflare:**
   ```bash
   wrangler login
   ```

3. **Deploy from Frontend Directory:**
   ```bash
   cd frontend
   pnpm run build
   wrangler pages deploy .next --project-name=deepfold-marketplace
   ```

### Method 3: Direct Upload

1. **Build the Project:**
   ```bash
   cd frontend
   pnpm install
   pnpm run build
   ```

2. **Upload via Dashboard:**
   - Go to **Cloudflare Pages** → **Create a project**
   - Choose **Direct Upload**
   - Upload the `.next` folder
   - Configure domain and settings

## Configuration Files

### `wrangler.toml`
Located at `/frontend/wrangler.toml` - contains Cloudflare Pages configuration.

### `.node-version`
Located at `/frontend/.node-version` - specifies Node.js version for builds.

### `next.config.mjs`
Already configured with:
- Image optimization disabled (Cloudflare handles this)
- Service Worker headers for PWA
- Manifest.json headers

## Environment Variables

Add these in Cloudflare Pages Dashboard → Settings → Environment Variables:

### Production Environment
```bash
NODE_VERSION=20
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.deepfold.com
NEXT_PUBLIC_SITE_URL=https://deepfold.com
```

### Preview Environment (for PR previews)
```bash
NODE_VERSION=20
NODE_ENV=preview
NEXT_PUBLIC_API_URL=https://api-preview.deepfold.com
NEXT_PUBLIC_SITE_URL=https://preview.deepfold.pages.dev
```

## Custom Domain Setup

1. **Add Custom Domain:**
   - Go to your Cloudflare Pages project
   - Click **Custom domains**
   - Click **Set up a custom domain**
   - Enter your domain: `deepfold.com` or `www.deepfold.com`

2. **DNS Configuration:**
   - Cloudflare will automatically create a CNAME record
   - Point your domain to the Pages URL
   - SSL/TLS is automatically provisioned

3. **Redirect Rules (Optional):**
   Create redirects in **Pages** → **Settings** → **Redirects**:
   ```
   # Redirect www to non-www
   https://www.deepfold.com/* → https://deepfold.com/:splat 301

   # Redirect HTTP to HTTPS
   http://deepfold.com/* → https://deepfold.com/:splat 301
   ```

## Build Configuration

### Build Command
```bash
cd frontend && pnpm install && pnpm run build
```

### Build Output Directory
```
frontend/.next
```

### Root Directory
```
frontend
```

### Node Version
```
20.11.0
```

## Cloudflare-Specific Optimizations

### 1. Image Optimization
Cloudflare automatically optimizes images. Update `next.config.mjs`:
```javascript
images: {
  unoptimized: false, // Let Cloudflare handle optimization
  domains: ['your-cdn-domain.com'],
}
```

### 2. Caching Strategy
Cloudflare Pages automatically caches static assets. Configure cache headers:
```javascript
// next.config.mjs
headers: async () => {
  return [
    {
      source: '/_next/static/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ];
},
```

### 3. Edge Functions (Optional)
For server-side logic at the edge:
```bash
# Create /functions directory at project root
mkdir -p frontend/functions

# Example: API route at /functions/api/hello.ts
export async function onRequest(context) {
  return new Response('Hello from Edge!');
}
```

## PWA Configuration for Cloudflare

The service worker and manifest.json are already configured. Ensure:

1. **Service Worker Headers** (already in next.config.mjs):
   ```javascript
   {
     source: '/sw.js',
     headers: [
       {
         key: 'Cache-Control',
         value: 'public, max-age=0, must-revalidate',
       },
       {
         key: 'Service-Worker-Allowed',
         value: '/',
       },
     ],
   }
   ```

2. **Manifest Headers** (already configured):
   ```javascript
   {
     source: '/manifest.json',
     headers: [
       {
         key: 'Cache-Control',
         value: 'public, max-age=604800, immutable',
       },
     ],
   }
   ```

## Deployment Workflow

### Automatic Deployments
Once connected to GitHub, Cloudflare Pages automatically:
- Deploys on every push to `main` branch (production)
- Creates preview deployments for pull requests
- Runs build checks before deploying

### Branch Deployments
Configure which branches trigger deployments:
- **Production branch:** `main` or `master`
- **Preview branches:** All other branches (automatic PR previews)

## Performance Optimizations

### 1. Enable Argo Smart Routing
- Go to **Speed** → **Optimization**
- Enable **Argo Smart Routing** for faster global delivery

### 2. Enable Auto Minify
- Go to **Speed** → **Optimization**
- Enable minification for HTML, CSS, and JavaScript

### 3. Enable Brotli Compression
- Automatically enabled on Cloudflare Pages
- Reduces file sizes by 20-30%

### 4. Configure Caching Rules
- Go to **Caching** → **Configuration**
- Set cache everything rules for static assets
- Configure browser cache TTL

## Monitoring & Analytics

### 1. Cloudflare Web Analytics
- Go to **Analytics** → **Web Analytics**
- Add analytics tag to your site
- Monitor page views, performance, and user behavior

### 2. Real User Monitoring (RUM)
- Already included with Cloudflare Pages
- View metrics in **Analytics** dashboard

### 3. Build Logs
- View build logs in **Pages** → **Deployments**
- Debug build failures and warnings

## Troubleshooting

### Build Fails
1. Check build logs in Cloudflare Pages dashboard
2. Verify Node.js version matches `.node-version`
3. Ensure all dependencies are in `package.json`
4. Check environment variables are set correctly

### Service Worker Not Working
1. Verify HTTPS is enabled (required for service workers)
2. Check service worker headers in next.config.mjs
3. Clear browser cache and re-register service worker

### Images Not Loading
1. Check image domains in next.config.mjs
2. Verify image paths are correct
3. Enable image optimization if needed

### API Calls Failing
1. Verify `NEXT_PUBLIC_API_URL` environment variable
2. Check CORS configuration on backend
3. Ensure backend is accessible from Cloudflare edge

## Security

### 1. Enable Security Headers
Add to `next.config.mjs`:
```javascript
headers: async () => {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on'
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin'
        },
      ],
    },
  ];
},
```

### 2. Enable Rate Limiting
- Go to **Security** → **WAF**
- Configure rate limiting rules
- Protect against DDoS attacks

### 3. Enable Bot Protection
- Go to **Security** → **Bots**
- Enable bot fight mode
- Configure bot management rules

## Costs

Cloudflare Pages offers:
- **Free Tier:**
  - Unlimited requests
  - Unlimited bandwidth
  - 500 builds per month
  - 1 concurrent build

- **Paid Plans ($20/month):**
  - 5,000 builds per month
  - 5 concurrent builds
  - Advanced preview deployments

## Useful Commands

```bash
# Install Wrangler CLI
pnpm add -g wrangler

# Login to Cloudflare
wrangler login

# Create new Pages project
wrangler pages project create deepfold-marketplace

# Deploy to Pages
cd frontend
pnpm run build
wrangler pages deploy .next

# View deployment logs
wrangler pages deployment list

# Rollback to previous deployment
wrangler pages deployment rollback

# Set environment variable
wrangler pages deployment create production --env NEXT_PUBLIC_API_URL=https://api.deepfold.com
```

## CI/CD with GitHub Actions (Optional)

Create `.github/workflows/deploy-cloudflare.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Install dependencies
        working-directory: ./frontend
        run: pnpm install
      
      - name: Build
        working-directory: ./frontend
        run: pnpm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: deepfold-marketplace
          directory: frontend/.next
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

## Support

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Cloudflare Community](https://community.cloudflare.com/)

## Summary

Your DeepFold Design Marketplace frontend is now ready for Cloudflare Pages deployment! 🚀

**Key Features:**
- ✅ Automatic deployments from GitHub
- ✅ Preview deployments for PRs
- ✅ Global CDN with edge caching
- ✅ PWA support with service workers
- ✅ Custom domain support
- ✅ Free SSL/TLS certificates
- ✅ Unlimited bandwidth
- ✅ Built-in analytics

**Next Steps:**
1. Connect repository to Cloudflare Pages
2. Configure environment variables
3. Deploy and test
4. Set up custom domain
5. Enable monitoring and analytics
