# Deployment Guide - Vercel

## Quick Deploy (Recommended)

### Option 1: Deploy via Vercel Dashboard

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite settings
   - Click "Deploy"
   - Done! Your dashboard is live 🎉

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Build Verification

Before deploying, verify the build works locally:

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

Visit http://localhost:4173 to test the production build.

## Environment Variables

No environment variables needed! The dashboard fetches data directly from the published Google Sheets CSV URL.

## Post-Deployment

After deployment, you'll get a URL like:
- `https://your-project.vercel.app`

### Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Updating the Dashboard

To update the live dashboard:

```bash
# Make your changes
git add .
git commit -m "Update dashboard"
git push

# Vercel will automatically redeploy
```

## Troubleshooting

### Error 126 - Build Command Failed

If you see "Command npm run build exited with 126":

1. **Check Node Version in Vercel**
   - Go to Project Settings → General
   - Set Node.js Version to `18.x` or `20.x`
   - Redeploy

2. **Clear Build Cache**
   - Go to Deployments
   - Click "..." menu → Redeploy
   - Check "Clear build cache"

3. **Verify Locally**
   ```bash
   npm install
   npm run build
   ```

### Build Fails
- Check `npm run build` works locally
- Ensure all dependencies are in package.json
- Check Node.js version (18+ required)
- Delete `node_modules` and `package-lock.json`, then `npm install`

### Data Not Loading
- Verify Google Sheets is published as CSV
- Check CSV_URL in Dashboard.jsx and BranchView.jsx
- Ensure CORS is enabled (Google Sheets CSV allows this by default)

### Blank Page
- Check browser console for errors
- Verify build completed successfully
- Clear browser cache
- Check if all routes redirect to index.html

## Performance

The dashboard is optimized for production:
- ✅ Code splitting (vendor chunks)
- ✅ Minified assets
- ✅ Optimized images
- ✅ Fast loading times

## Support

For deployment issues:
- Vercel Docs: https://vercel.com/docs
- Vite Docs: https://vitejs.dev/guide/

---

**Your dashboard is production-ready! 🚀**
