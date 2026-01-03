# Deployment Checklist for Vercel

## Pre-Deployment Checklist

### ✅ Completed
- [x] TypeScript build errors fixed
- [x] Production build working successfully
- [x] Code splitting optimized (Bundle size reduced from 594 kB to 256 kB for main chunk)
- [x] Vercel configuration file (`vercel.json`) in place
- [x] Environment variables template (`.env.example`) created
- [x] `.gitignore` properly configured for environment files
- [x] README.md updated with detailed deployment instructions

### 📋 Before You Deploy

1. **Ensure all changes are committed**
   ```bash
   git status
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Verify Firebase Project Setup**
   - [ ] Firebase project created
   - [ ] Authentication enabled (Email/Password)
   - [ ] Firestore database created
   - [ ] Storage bucket created
   - [ ] Admin user created in Firebase Authentication

3. **Prepare Environment Variables**

   Have these values ready from your Firebase Console:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

## Deployment Steps

### Option 1: Vercel (Recommended)

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Build Settings**
   - Framework Preset: **Vite** (auto-detected)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `dist` (auto-detected)
   - Install Command: `npm install` (auto-detected)

4. **Add Environment Variables**
   - Go to: Project Settings > Environment Variables
   - Add each variable listed above
   - For each variable, select: ✓ Production ✓ Preview ✓ Development

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Visit your live site!

### Vercel CLI (Alternative)

```bash
npm install -g vercel
vercel login
vercel
# Follow the prompts and add environment variables when asked
```

## Post-Deployment

### Verify Deployment

- [ ] Site loads correctly
- [ ] Navigation works (all routes accessible)
- [ ] Admin panel accessible at `/admin`
- [ ] Firebase authentication working
- [ ] No console errors

### Test Admin Features

- [ ] Can log in to admin panel
- [ ] Can add/delete countdown events
- [ ] Can edit page content
- [ ] Changes persist in Firebase

### Optional: Custom Domain

1. In Vercel Dashboard: Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Build Output Summary

Current optimized bundle sizes:
- **index.html**: 0.72 kB (gzip: 0.36 kB)
- **CSS**: 2.94 kB (gzip: 1.21 kB)
- **React vendor**: 46.90 kB (gzip: 16.69 kB)
- **Animation vendor**: 138.82 kB (gzip: 48.13 kB)
- **Firebase vendor**: 149.87 kB (gzip: 49.05 kB)
- **Main bundle**: 256.75 kB (gzip: 74.14 kB)

**Total**: ~595 kB (gzip: ~188 kB)

## Troubleshooting

### Build Fails on Vercel

- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify Node.js version (should use 18+)

### Firebase Not Working

- Double-check all environment variables are correct
- Ensure Firebase project is not in "Locked" mode
- Verify Firebase rules allow read/write access

### Routing Issues (404 on refresh)

- `vercel.json` should contain SPA rewrites (already configured)
- If missing, add:
  ```json
  {
    "rewrites": [
      {
        "source": "/(.*)",
        "destination": "/index.html"
      }
    ]
  }
  ```

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Firebase Documentation](https://firebase.google.com/docs)

---

**Ready to deploy? Follow the steps above and your Valentine's Day site will be live!** 💕
