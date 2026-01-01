# Cloudflare Pages Quick Start Guide

## 🚀 Quick Deploy (3 Methods)

### Method 1: Cloudflare Dashboard (Easiest - Recommended)

1. **Connect Repository:**
   - Visit [Cloudflare Pages Dashboard](https://dash.cloudflare.com/?to=/:account/pages)
   - Click **"Create a project"** → **"Connect to Git"**
   - Select your GitHub repository: `infex1rn/PROJECT-YEBA`
   - Authorize Cloudflare

2. **Configure Build:**
   ```
   Framework preset:       Next.js
   Build command:          cd frontend && pnpm install && pnpm run build  
   Build output:           frontend/out
   Root directory:         / (project root)
   Node version:           20
   ```

3. **Set Environment Variables:**
   - Go to **Settings** → **Environment variables**
   - Add: `NEXT_PUBLIC_API_URL` = `https://your-api.com`
   - Click **"Save and Deploy"**

4. **Deploy:**
   - Your site will be live at: `https://your-project.pages.dev`
   - Custom domain: **Settings** → **Custom domains**

---

### Method 2: Wrangler CLI (For Developers)

```bash
# 1. Install Wrangler globally
pnpm add -g wrangler

# 2. Login to Cloudflare
wrangler login

# 3. Build the project
cd frontend
pnpm install
pnpm run build

# 4. Deploy to Cloudflare Pages
wrangler pages deploy out --project-name=deepfold-marketplace

# Or use the npm script
pnpm cf:deploy
```

---

### Method 3: GitHub Actions (Automated CI/CD)

Already configured! Just add these secrets to your GitHub repository:

1. **Go to:** Repository **Settings** → **Secrets and variables** → **Actions**

2. **Add Secrets:**
   ```
   CLOUDFLARE_API_TOKEN     = your_cloudflare_api_token
   CLOUDFLARE_ACCOUNT_ID    = your_cloudflare_account_id
   NEXT_PUBLIC_API_URL      = https://api.deepfold.com
   ```

3. **Get API Token:**
   - Visit: https://dash.cloudflare.com/profile/api-tokens
   - Click **"Create Token"**
   - Use **"Edit Cloudflare Pages"** template
   - Copy token

4. **Get Account ID:**
   - Go to Cloudflare Dashboard
   - Select your domain
   - Account ID is in the right sidebar

5. **Auto-deploy:**
   - Push to `main` branch → Production deploy
   - Open PR → Preview deploy
   - Check **Actions** tab for logs

---

## 📋 Configuration Checklist

- [x] `wrangler.toml` - Cloudflare config
- [x] `.node-version` - Node.js version (20)
- [x] `next.config.mjs` - Next.js config with static export
- [x] `_headers` - Security headers
- [x] `_redirects` - URL redirects
- [x] `.github/workflows/deploy-cloudflare.yml` - CI/CD
- [x] `.env.cloudflare` - Environment variables guide

---

## 🔧 Local Development

```bash
# Install dependencies
cd frontend
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm run build

# Preview production build locally
pnpm start

# Test with Cloudflare Pages emulator
pnpm cf:dev
```

---

## 🌐 Environment Variables

### Production (Required)
```bash
NEXT_PUBLIC_API_URL=https://api.deepfold.com
```

### Optional
```bash
NEXT_PUBLIC_SITE_URL=https://deepfold.com
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

Set these in:
- **Cloudflare Dashboard:** Settings → Environment variables
- **GitHub Secrets:** For automated deployments
- **Local `.env.local`:** For development

---

## 📱 Features Enabled

✅ Static site export optimized for Cloudflare  
✅ PWA support with service workers  
✅ IndexedDB offline storage  
✅ Mobile routes (`/m/*`)  
✅ SEO optimization  
✅ Security headers  
✅ Automatic HTTPS  
✅ Global CDN  
✅ Preview deployments for PRs  

---

## 🔍 Verify Deployment

After deployment, test:

1. **Homepage:** `https://your-site.pages.dev/`
2. **Marketplace:** `https://your-site.pages.dev/marketplace`
3. **Mobile:** `https://your-site.pages.dev/m/marketplace`
4. **PWA Install:** Chrome → Address bar → Install icon
5. **Offline:** DevTools → Application → Service Workers → Offline checkbox

---

## 🐛 Troubleshooting

### Build Fails
- Check build logs in Cloudflare dashboard
- Verify Node.js version: `20.11.0`
- Ensure `package.json` has all dependencies

### 404 Errors
- Check `_redirects` file is in `out/` directory
- Verify `output: 'export'` in `next.config.mjs`

### Environment Variables Not Working
- Prefix with `NEXT_PUBLIC_` for client-side access
- Restart build after adding variables
- Check variable is set in correct environment (production/preview)

### Service Worker Not Working
- HTTPS is required (auto-enabled on Cloudflare)
- Check browser console for errors
- Clear cache and hard reload

---

## 📊 Monitoring

**Cloudflare Dashboard:**
- Analytics: Track page views, performance
- Logs: View deployment and runtime logs
- Cache: Monitor cache hit rates

**Web Analytics:**
- Visit: Dashboard → Analytics → Web Analytics
- Add analytics tag to your site

---

## 💰 Costs

**Free Tier Includes:**
- ✅ Unlimited requests
- ✅ Unlimited bandwidth
- ✅ 500 builds/month
- ✅ 1 concurrent build
- ✅ Preview deployments

**Paid ($20/month):**
- 5,000 builds/month
- 5 concurrent builds
- Advanced analytics

---

## 🎯 Next Steps

1. **Custom Domain:**
   - Pages → Custom domains → Add domain
   - DNS auto-configured

2. **Preview URLs:**
   - Each PR gets unique URL
   - Test before merging

3. **Rollback:**
   - Pages → Deployments → View all
   - Click any deployment → Rollback

4. **Monitoring:**
   - Enable Web Analytics
   - Set up alerts

---

## 📚 Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Full Deployment Guide](../CLOUDFLARE-DEPLOYMENT.md)

---

## ✅ You're Ready!

Your DeepFold frontend is configured for Cloudflare Pages. Choose a deployment method above and go live! 🚀
