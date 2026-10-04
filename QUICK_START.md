# Supabase Connection Checklist

## What You Need to Do

### 1. Create Supabase Project
- [ ] Go to https://supabase.com
- [ ] Create a new project
- [ ] Save the database password somewhere safe
- [ ] Wait for project to be ready (~2 minutes)

### 2. Get Credentials
- [ ] Go to Settings → API
- [ ] Copy **Project URL** (e.g., `https://abc.supabase.co`)
- [ ] Copy **anon public key** (starts with `eyJ...`)

### 3. Create .env File
- [ ] Create a file named `.env` in the project root
- [ ] Add these lines:
  ```
  VITE_SUPABASE_URL=your-project-url-here
  VITE_SUPABASE_ANON_KEY=your-anon-key-here
  ```
- [ ] Save the file

### 4. Run Database Schema
- [ ] Go to Supabase Dashboard → SQL Editor
- [ ] Click "New query"
- [ ] Open `supabase-schema.sql` file
- [ ] Copy all the SQL code
- [ ] Paste into SQL Editor
- [ ] Click "Run"
- [ ] Verify tables were created (Table Editor → should see users, products, orders)

### 5. Test It
- [ ] Run `npm run dev`
- [ ] Open browser
- [ ] Yellow warning should NOT appear (if it does, check .env file)
- [ ] Try adding a person
- [ ] Check Supabase Table Editor → users table
- [ ] Your person should be there!

### 6. Deploy (When Ready)
- [ ] Set environment variables in your hosting platform
- [ ] Redeploy

---

## Files Created for You

✅ `src/lib/supabase.ts` - Supabase client configuration  
✅ `src/lib/db.ts` - Updated to use Supabase instead of localStorage  
✅ `supabase-schema.sql` - Database schema (run this in Supabase)  
✅ `.env.example` - Template for environment variables  
✅ `SETUP_GUIDE.md` - Detailed setup instructions  
✅ `src/vite-env.d.ts` - TypeScript types for environment variables  

---

## Quick Reference

### Environment Variables
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

### Database Tables
- **users** - People (students, sellers, admins)
- **products** - Product listings
- **orders** - Purchase orders

### Key Features Working
- ✅ Add people (sellers/students)
- ✅ Verify/ban/unban users
- ✅ Add products
- ✅ Approve/reject products
- ✅ View orders
- ✅ Update order status
- ✅ Bulk actions
- ✅ Dashboard stats
- ✅ CSV export

---

## Troubleshooting

**Problem**: "Supabase not configured" warning  
**Solution**: Check `.env` file exists and has correct values

**Problem**: "relation does not exist" error  
**Solution**: Run `supabase-schema.sql` in SQL Editor

**Problem**: Data not saving  
**Solution**: Check browser console (F12) for errors

---

## Need Help?

1. Read `SETUP_GUIDE.md` for detailed instructions
2. Check Supabase docs: https://supabase.com/docs
3. Check browser console for error messages

---

## You're Done When:

✅ No yellow warning banner appears  
✅ You can add people successfully  
✅ Data shows up in Supabase Table Editor  
✅ All features work (verify, ban, approve, etc.)
