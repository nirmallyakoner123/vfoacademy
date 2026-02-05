# Deployment Guide: Virtual Film Office Academy (Full-Stack)

This guide covers deploying your unified repository (frontend + backend) to production.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Deployment Platforms](#deployment-platforms)
4. [Environment Configuration](#environment-configuration)
5. [Domain Setup](#domain-setup)
6. [Post-Deployment](#post-deployment)

---

## Prerequisites

Before deploying, ensure you have:

- ✅ GitHub account with your new repository pushed
- ✅ Supabase project created and configured
- ✅ Domain name (optional, but recommended)
- ✅ All environment variables documented

---

## Quick Start

### Step 1: Run the Duplication Script

```powershell
# Navigate to your current project
cd "C:\Users\Nirmallya Koner\Desktop\Virtual Flim Office Academy\admin-portal"

# Run the script with your GitHub username
.\duplicate-repo.ps1 -GitHubUsername "YOUR_GITHUB_USERNAME"

# Or run without GitHub username (you'll add it manually later)
.\duplicate-repo.ps1
```

### Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Repository name: `Virtual-Film-Office-Academy-Full` (or your chosen name)
3. Description: "Full-stack Learning Management System with Next.js and Supabase"
4. **Keep it Private** (recommended) or Public
5. **Do NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

### Step 3: Push Your Code

```powershell
cd "C:\Users\Nirmallya Koner\Desktop\Virtual-Film-Office-Academy-Full"

# If you didn't provide GitHub username in script
git remote add origin https://github.com/YOUR_USERNAME/Virtual-Film-Office-Academy-Full.git
git branch -M main

# Push to GitHub
git push -u origin main
```

---

## Deployment Platforms

### Option 1: Vercel (Recommended for Next.js)

**Why Vercel?**
- ✅ Built specifically for Next.js
- ✅ Automatic deployments on git push
- ✅ Free SSL certificates
- ✅ Excellent performance
- ✅ Free tier available

**Steps:**

1. **Go to [Vercel](https://vercel.com)**
2. **Sign in with GitHub**
3. **Import your repository:**
   - Click "Add New" → "Project"
   - Select `Virtual-Film-Office-Academy-Full`
4. **Configure project:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (leave as default)
   - Build Command: `npm run build` (auto-filled)
   - Output Directory: `.next` (auto-filled)
5. **Add Environment Variables** (see [Environment Configuration](#environment-configuration))
6. **Click "Deploy"**

**Custom Domain Setup:**
- Go to Project Settings → Domains
- Add your domain (e.g., `app.yoursite.com`)
- Follow DNS configuration instructions

---

### Option 2: Netlify

**Steps:**

1. **Go to [Netlify](https://netlify.com)**
2. **Sign in with GitHub**
3. **Import repository:**
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub → Select your repo
4. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Add environment variables
5. **Deploy**

---

### Option 3: Railway

**Why Railway?**
- ✅ Supports full-stack apps
- ✅ Easy database integration
- ✅ Simple pricing

**Steps:**

1. **Go to [Railway](https://railway.app)**
2. **Sign in with GitHub**
3. **New Project** → "Deploy from GitHub repo"
4. **Select your repository**
5. **Add environment variables**
6. **Deploy**

---

## Environment Configuration

### Required Environment Variables

Create a `.env.local` file or add these to your deployment platform:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: Analytics, monitoring, etc.
# NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### How to Add Environment Variables

#### Vercel:
1. Project Settings → Environment Variables
2. Add each variable with its value
3. Select environments: Production, Preview, Development
4. Click "Save"

#### Netlify:
1. Site Settings → Build & Deploy → Environment
2. Click "Edit variables"
3. Add each variable
4. Click "Save"

#### Railway:
1. Project → Variables tab
2. Click "New Variable"
3. Add each variable

### Getting Supabase Credentials

```powershell
# If using Supabase CLI
supabase status

# Or get from Supabase Dashboard:
# 1. Go to https://app.supabase.com
# 2. Select your project
# 3. Settings → API
# 4. Copy "Project URL" and "anon public" key
```

---

## Domain Setup

### Two-Repository Strategy

You mentioned wanting to keep design separate. Here's the recommended setup:

| Repository | Purpose | Domain Example |
|------------|---------|----------------|
| **Original Repo** | Design/Frontend only | `design.yoursite.com` |
| **New Unified Repo** | Full-stack (Design + Backend) | `app.yoursite.com` or `yoursite.com` |

### DNS Configuration

#### For Vercel:

1. **Add domain in Vercel:**
   - Project Settings → Domains
   - Enter your domain (e.g., `app.yoursite.com`)

2. **Update DNS records** (in your domain registrar):
   ```
   Type: CNAME
   Name: app (or @ for root domain)
   Value: cname.vercel-dns.com
   ```

3. **Wait for DNS propagation** (5-60 minutes)

#### For Netlify:

1. **Add domain in Netlify:**
   - Domain Settings → Add custom domain

2. **Update DNS records:**
   ```
   Type: CNAME
   Name: app
   Value: your-site-name.netlify.app
   ```

---

## Post-Deployment

### 1. Run Database Migrations

If you haven't already, apply your Supabase migrations:

```bash
# Using Supabase CLI
supabase db push

# Or manually in Supabase Dashboard:
# SQL Editor → Run each migration file
```

### 2. Test Your Deployment

- ✅ Visit your deployed URL
- ✅ Test authentication (login/signup)
- ✅ Test course creation (admin)
- ✅ Test learner portal
- ✅ Check all API endpoints
- ✅ Verify file uploads work

### 3. Set Up Monitoring

**Vercel Analytics:**
- Enable in Project Settings → Analytics

**Error Tracking:**
- Consider [Sentry](https://sentry.io) for error monitoring

### 4. Configure CORS (if needed)

If your frontend and backend are on different domains, update Supabase CORS settings:

1. Supabase Dashboard → Authentication → URL Configuration
2. Add your deployment URL to "Site URL"
3. Add to "Redirect URLs" if using OAuth

---

## Troubleshooting

### Build Fails

**Check:**
- All environment variables are set
- `package.json` dependencies are correct
- Node version compatibility (use Node 18+)

**Fix:**
```json
// Add to package.json if needed
"engines": {
  "node": ">=18.0.0"
}
```

### Environment Variables Not Working

- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding new variables
- Check variable names match exactly (case-sensitive)

### Database Connection Issues

- Verify Supabase URL and keys are correct
- Check Supabase project is not paused
- Ensure RLS policies allow access

### 404 Errors on Routes

- Ensure Next.js is configured correctly
- Check `next.config.ts` for any custom routing
- Verify all pages are in the `app` directory

---

## Deployment Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] Test authentication flow
- [ ] Test admin features
- [ ] Test learner features
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active (auto with Vercel/Netlify)
- [ ] Error monitoring set up
- [ ] Backup strategy in place
- [ ] README updated with deployment info

---

## Next Steps

1. **Monitor your deployment** for the first few days
2. **Set up automatic backups** for your Supabase database
3. **Configure CI/CD** for automatic deployments on push
4. **Add staging environment** for testing before production

---

## Support

If you encounter issues:

1. Check deployment platform logs
2. Review Supabase logs (Dashboard → Logs)
3. Check browser console for client-side errors
4. Verify all environment variables are set correctly

---

**Happy Deploying! 🚀**
