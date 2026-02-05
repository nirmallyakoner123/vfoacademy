# Quick Start: Repository Duplication & Deployment

## 🚀 Quick Commands

### 1. Duplicate Your Repository

```powershell
# Navigate to your project
cd "C:\Users\Nirmallya Koner\Desktop\Virtual Flim Office Academy\admin-portal"

# Run the duplication script
.\duplicate-repo.ps1 -GitHubUsername "YOUR_GITHUB_USERNAME"
```

### 2. Create GitHub Repository

1. Go to https://github.com/new
2. Name: `Virtual-Film-Office-Academy-Full`
3. **Don't** initialize with README
4. Click "Create repository"

### 3. Push to GitHub

```powershell
cd "C:\Users\Nirmallya Koner\Desktop\Virtual-Film-Office-Academy-Full"
git push -u origin main
```

### 4. Deploy to Vercel

1. Go to https://vercel.com
2. Import your GitHub repository
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click "Deploy"

---

## 📁 What Gets Created

```
Desktop/
├── Virtual Flim Office Academy/     (Original - Design only)
│   └── admin-portal/
└── Virtual-Film-Office-Academy-Full/ (New - Design + Backend)
    ├── app/                          (Next.js pages)
    ├── components/                   (UI components)
    ├── lib/                          (Services & utilities)
    ├── supabase/                     (Database migrations)
    ├── .env.example                  (Environment template)
    └── package.json
```

---

## 🌐 Two-Repo Strategy

| Repository | Contains | Deploy To |
|------------|----------|-----------|
| **Original** | Design/Frontend only | `design.yoursite.com` |
| **New Unified** | Design + Backend | `app.yoursite.com` |

---

## 📝 Script Options

```powershell
# Basic usage
.\duplicate-repo.ps1

# With GitHub username (auto-configures remote)
.\duplicate-repo.ps1 -GitHubUsername "yourusername"

# Custom repo name
.\duplicate-repo.ps1 -NewRepoName "My-Custom-Name"

# Skip Git initialization (manual setup)
.\duplicate-repo.ps1 -SkipGitInit
```

---

## ⚙️ Environment Variables Needed

Copy from your `.env` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Get these from: Supabase Dashboard → Settings → API

---

## ✅ Deployment Checklist

- [ ] Run `duplicate-repo.ps1`
- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] Deploy to Vercel/Netlify
- [ ] Add environment variables
- [ ] Configure custom domain (optional)
- [ ] Test deployment
- [ ] Apply database migrations

---

## 🆘 Troubleshooting

**Script won't run?**
```powershell
# Enable script execution
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

**Build fails on deployment?**
- Check all environment variables are set
- Verify Supabase credentials are correct
- Check deployment logs for specific errors

**Need help?**
- See full guide: `DEPLOYMENT_GUIDE.md`
- Check Vercel logs: Project → Deployments → View logs
- Check Supabase logs: Dashboard → Logs

---

## 📚 Full Documentation

- **Deployment Guide**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Project Overview**: [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)
- **Supabase Setup**: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
