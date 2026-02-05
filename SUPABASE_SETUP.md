# Supabase Backend Setup Guide

## Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Node.js**: Version 16 or higher
3. **Supabase CLI** (optional but recommended): `npm install -g supabase`

## Step 1: Create Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in project details:
   - **Name**: Virtual Film Office Academy
   - **Database Password**: Choose a strong password (save it securely)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is sufficient for development

4. Wait for project to be provisioned (2-3 minutes)

## Step 2: Get Project Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)

## Step 3: Configure Environment Variables

1. Create `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

2. Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Step 4: Run Database Migrations

### Option A: Using Supabase Dashboard (Recommended for beginners)

1. Go to **SQL Editor** in your Supabase dashboard
2. Create a new query
3. Copy and paste the contents of each migration file in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_storage_setup.sql`
4. Run each query by clicking "Run"

### Option B: Using Supabase CLI

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

## Step 5: Verify Database Setup

1. Go to **Table Editor** in Supabase dashboard
2. You should see all tables:
   - profiles
   - courses
   - weeks
   - lessons
   - assessments
   - questions
   - answer_options
   - enrollments
   - lesson_progress
   - assessment_attempts
   - attempt_answers
   - certificates
   - course_instructors
   - assets

## Step 6: Create First Admin User

1. Go to **Authentication** → **Users** in Supabase dashboard
2. Click "Add user" → "Create new user"
3. Fill in:
   - **Email**: your admin email
   - **Password**: choose a strong password
   - **Auto Confirm User**: ✓ (check this)
4. Click "Create user"

5. Go to **SQL Editor** and run:

```sql
-- Update the user's profile to be super admin
UPDATE profiles
SET role = 'super_admin',
    full_name = 'Your Name',
    is_active = true
WHERE email = 'your-admin-email@example.com';
```

## Step 7: Verify Storage Buckets

1. Go to **Storage** in Supabase dashboard
2. You should see these buckets:
   - `course-thumbnails` (public)
   - `course-videos` (private)
   - `course-pdfs` (private)
   - `user-avatars` (public)
   - `certificates` (private)

## Step 8: Test Authentication

1. Start your Next.js development server:

```bash
npm run dev
```

2. Navigate to the admin login page
3. Try logging in with your admin credentials
4. You should be redirected to the admin dashboard

## Step 9: Enable Email Authentication (Optional)

1. Go to **Authentication** → **Providers** in Supabase
2. Enable "Email" provider
3. Configure email templates:
   - Go to **Authentication** → **Email Templates**
   - Customize confirmation, reset password, and magic link emails

## Step 10: Configure SMTP (Production)

For production, configure custom SMTP:

1. Go to **Settings** → **Auth**
2. Scroll to "SMTP Settings"
3. Enable custom SMTP and fill in your email provider details

## Troubleshooting

### Issue: "Missing environment variables"
- Ensure `.env.local` exists and contains all required variables
- Restart your dev server after adding env variables

### Issue: "Database connection failed"
- Check your `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify your project is active in Supabase dashboard

### Issue: "RLS policy violation"
- Ensure you've run all migration files
- Check that your user has the correct role in the `profiles` table

### Issue: "Storage upload fails"
- Verify storage buckets exist
- Check storage policies are applied (migration 003)
- Ensure file size is within limits

## Next Steps

1. ✅ Backend foundation is set up
2. 📝 Integrate authentication in frontend components
3. 🎨 Build admin course creation UI
4. 👥 Implement employee management
5. 📚 Create learner portal

## Useful Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Generate TypeScript types from Supabase (optional)
npx supabase gen types typescript --project-id your-project-ref > types/database.ts
```

## Security Checklist

- [ ] Environment variables are in `.env.local` (not committed to git)
- [ ] Service role key is kept secret
- [ ] RLS policies are enabled on all tables
- [ ] Storage policies restrict access appropriately
- [ ] Admin users are properly configured
- [ ] Email confirmation is enabled for production

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)
